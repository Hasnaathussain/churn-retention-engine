from __future__ import annotations

from typing import Any

from fastapi import Header, HTTPException

from config import allow_demo_mode, demo_workspace_id, demo_workspace_name
from schemas import WorkspaceContext, WorkspaceMode, WorkspaceRole
from state import get_workspace_state


def _normalize_role(value: str | None) -> WorkspaceRole:
    if value == "member":
        return "member"
    return "owner"


def _normalize_mode(value: str | None, workspace_id: str) -> WorkspaceMode:
    if value == "live":
        return "live"
    if value == "demo":
        return "demo"
    if workspace_id.startswith("demo"):
        return "demo"
    return "live"


def get_workspace_context(
    x_workspace_id: str | None = Header(default=None, alias="X-Workspace-ID"),
    x_workspace_name: str | None = Header(default=None, alias="X-Workspace-Name"),
    x_workspace_role: str | None = Header(default=None, alias="X-Workspace-Role"),
    x_workspace_mode: str | None = Header(default=None, alias="X-Workspace-Mode"),
    x_workspace_user: str | None = Header(default=None, alias="X-Workspace-User"),
) -> WorkspaceContext:
    workspace_id = x_workspace_id or (
        demo_workspace_id() if allow_demo_mode() else "live-workspace"
    )
    workspace_name = x_workspace_name or (
        demo_workspace_name() if allow_demo_mode() else "Anchoryn Workspace"
    )
    mode = _normalize_mode(x_workspace_mode, workspace_id)
    if not x_workspace_id and not allow_demo_mode():
        mode = "live"

    get_workspace_state(workspace_id, workspace_name, mode)

    return WorkspaceContext(
        workspaceId=workspace_id,
        workspaceName=workspace_name,
        role=_normalize_role(x_workspace_role),
        mode=mode,
        userEmail=x_workspace_user,
    )


def workspace_context_from_metadata(metadata: dict[str, Any] | None) -> WorkspaceContext:
    payload = metadata or {}
    workspace_id = str(payload.get("workspace_id") or payload.get("workspaceId") or demo_workspace_id())
    workspace_name = str(
        payload.get("workspace_name")
        or payload.get("workspaceName")
        or demo_workspace_name()
    )
    get_workspace_state(workspace_id, workspace_name, "live")

    return WorkspaceContext(
        workspaceId=workspace_id,
        workspaceName=workspace_name,
        role="owner",
        mode="live",
        userEmail=payload.get("user_email") or payload.get("userEmail"),
    )


def require_owner_context(context: WorkspaceContext) -> WorkspaceContext:
    if context.role != "owner":
        raise HTTPException(status_code=403, detail="Owner access required")
    return context
