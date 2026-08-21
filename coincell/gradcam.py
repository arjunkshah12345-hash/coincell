from __future__ import annotations

import cv2
import numpy as np
import torch
import torch.nn.functional as F

from coincell.models import CoinCellNet, DualViewNet


def compute_gradcam(
    model: CoinCellNet | DualViewNet,
    tensor: torch.Tensor,
    target_class: int,
    device: str,
) -> np.ndarray:
    model.eval()
    tensor = tensor.to(device)

    activations: list[torch.Tensor] = []
    gradients: list[torch.Tensor] = []

    def fwd_hook(_mod, _inp, out):
        activations.append(out)
        out.retain_grad()

    handle = model.encoder.blocks[-1].register_forward_hook(fwd_hook) if isinstance(model, CoinCellNet) else \
        model.ap_encoder.blocks[-1].register_forward_hook(fwd_hook)

    try:
        model.zero_grad()
        if isinstance(model, DualViewNet):
            logits = model(tensor, None)
        else:
            logits = model(tensor)
        score = logits[0, target_class]
        score.backward()

        if not activations or activations[0].grad is None:
            h, w = tensor.shape[2], tensor.shape[3]
            return np.zeros((h, w), dtype=np.float32)

        feats = activations[0]
        grads = feats.grad
        weights = grads.mean(dim=(2, 3), keepdim=True)
        cam = (weights * feats).sum(dim=1, keepdim=True)
        cam = F.relu(cam)
        cam = cam.squeeze().detach().cpu().numpy()
        cam = cam - cam.min()
        if cam.max() > 0:
            cam = cam / cam.max()
        cam = cv2.resize(cam, (tensor.shape[3], tensor.shape[2]))
        return cam.astype(np.float32)
    finally:
        handle.remove()


def overlay_gradcam(base_gray: np.ndarray, cam: np.ndarray, alpha: float = 0.45) -> np.ndarray:
    u8 = (np.clip(base_gray, 0, 1) * 255).astype(np.uint8)
    rgb = cv2.cvtColor(u8, cv2.COLOR_GRAY2RGB)
    heat = cv2.applyColorMap((cam * 255).astype(np.uint8), cv2.COLORMAP_JET)
    heat = cv2.cvtColor(heat, cv2.COLOR_BGR2RGB)
    return cv2.addWeighted(rgb, 1 - alpha, heat, alpha, 0)
