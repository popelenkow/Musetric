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