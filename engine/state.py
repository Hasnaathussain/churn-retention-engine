from __future__ import annotations

from copy import deepcopy

from seed_data import clone_workspace_state, create_demo_workspace
from schemas import WorkspaceMode, WorkspaceState

WORKSPACE_STATE: dict[str, WorkspaceState] = {}


def get_workspace_state(
    workspace_id: str,
    workspace_name: str | None = None,
    mode: WorkspaceMode = "demo",
) -> WorkspaceState:
    if workspace_id not in WORKSPACE_STATE:
        WORKSPACE_STATE[workspace_id] = create_demo_workspace(
            workspace_id=workspace_id,
            workspace_name=workspace_name or "Synapse Demo Workspace",
            mode=mode,
        )
    else:
        state = WORKSPACE_STATE[workspace_id]
        if workspace_name and state.workspace.workspaceName != workspace_name:
            state.workspace.workspaceName = workspace_name
        state.workspace.mode = mode

    return WORKSPACE_STATE[workspace_id]


def seed_workspace_state(
    workspace_id: str,
    workspace_name: str,
    mode: WorkspaceMode = "live",
) -> WorkspaceState:
    state = create_demo_workspace(
        workspace_id=workspace_id,
        workspace_name=workspace_name,
        mode=mode,
    )
    WORKSPACE_STATE[workspace_id] = state
    return state


def reset_workspace_state(workspace_id: str) -> WorkspaceState:
    state = WORKSPACE_STATE.get(workspace_id)
    if not state:
        return create_demo_workspace(workspace_id=workspace_id)

    WORKSPACE_STATE[workspace_id] = clone_workspace_state(
        state,
        workspace_id=workspace_id,
        workspace_name=state.workspace.workspaceName,
    )
    return WORKSPACE_STATE[workspace_id]


def snapshot_workspace_state(workspace_id: str) -> WorkspaceState | None:
    state = WORKSPACE_STATE.get(workspace_id)
    return deepcopy(state) if state else None
