from __future__ import annotations

import torch
import torch.nn as nn
import torch.nn.functional as F


CLASS_NAMES = ["battery", "coin", "normal"]


class ConvBlock(nn.Module):
    def __init__(self, in_ch: int, out_ch: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class ViewEncoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.blocks = nn.Sequential(
            ConvBlock(3, 32),
            ConvBlock(32, 64),
            ConvBlock(64, 128),
        )
        self.pool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.pool(self.blocks(x)).flatten(1)


class CoinCellNet(nn.Module):
    """Single-view classifier with feature hooks for Grad-CAM."""

    def __init__(self, num_classes: int = 3):
        super().__init__()
        self.encoder = ViewEncoder()
        self.head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.25),
            nn.Linear(64, num_classes),
        )
        self._features: torch.Tensor | None = None
        self.encoder.blocks[-1].register_forward_hook(self._hook)

    def _hook(self, _module, _inp, out):
        self._features = out

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feats = self.encoder(x)
        return self.head(feats)

    @property
    def cam_features(self) -> torch.Tensor | None:
        return self._features


class DualViewNet(nn.Module):
    """Fuses AP + lateral encoders — the core clinical innovation."""

    def __init__(self, num_classes: int = 3):
        super().__init__()
        self.ap_encoder = ViewEncoder()
        self.lat_encoder = ViewEncoder()
        self.fusion = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),
        )
        self._ap_features: torch.Tensor | None = None
        self.ap_encoder.blocks[-1].register_forward_hook(self._ap_hook)

    def _ap_hook(self, _module, _inp, out):
        self._ap_features = out

    def forward(self, ap: torch.Tensor, lat: torch.Tensor | None = None) -> torch.Tensor:
        ap_feat = self.ap_encoder(ap)
        if lat is not None:
            lat_feat = self.lat_encoder(lat)
            fused = torch.cat([ap_feat, lat_feat], dim=1)
        else:
            fused = torch.cat([ap_feat, torch.zeros_like(ap_feat)], dim=1)
        return self.fusion(fused)

    @property
    def cam_features(self) -> torch.Tensor | None:
        return self._ap_features
