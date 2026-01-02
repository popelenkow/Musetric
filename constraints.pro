% Ensure consistent dependency versions across workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType) :-
  workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType),
  WorkspaceCwd \= OtherWorkspaceCwd.

% Ensure consistent peer dependency versions across workspaces  
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, peerDependencies) :-
  workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange, peerDependencies),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, peerDependencies),
  WorkspaceCwd \= OtherWorkspaceCwd.

% Ensure workspaces list peer deps of any workspace dependency.
gen_enforced_dependency(WorkspaceCwd, PeerIdent, PeerRange, DependencyType) :-
  dependency_type(DependencyType),
  DependencyType \= peerDependencies,
  workspace_ident(DependencyWorkspaceCwd, WorkspaceIdent),
  workspace_has_dependency(WorkspaceCwd, WorkspaceIdent, _, DependencyType),
  workspace_has_dependency(DependencyWorkspaceCwd, PeerIdent, PeerRange, peerDependencies),
  PeerIdent \= WorkspaceIdent,
  WorkspaceCwd \= DependencyWorkspaceCwd.
