"use client"
import { workspace } from "@/lib/supabase/supabase.types"
import { useEffect, useState } from "react"
import { useAppState } from "@/lib/providers/state-provider"
import SelectedWorkspace from "./selected-workspace"
import CustomDialogTrigger from "../global/custom-dialog"
import WorkspaceCreator from "../global/workspace-creator"
import { ScrollArea } from "../ui/scroll-area"

type WorkspaceDropdownProps = {
  privateWorkspaces: workspace[] | []
  sharedWorkspaces: workspace[] | []
  collaboratingWorkspaces: workspace[] | []
  defaultValue: workspace | undefined
}
const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}) => {
  const { dispatch, state } = useAppState()
  const [selectedOption, setSelectedOption] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      })
    }
  }, [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces])

  const handleSelect = (option: workspace) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!defaultValue) return
    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultValue.id
    )
    if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace)
  }, [state, defaultValue])

  return (
    <div
      className="
        w-full
        relative
        inline-block
        text-left
        box-border
      "
    >
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            "Select a workspace"
          )}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-16 w-full h-auto">
          <ScrollArea
            className="
          w-full
          rounded-md
          shadow-md
          z-50
          h-[190px]
          bg-black/10
          backdrop-blur-lg
          group
          border-[1px]
          border-muted
          !p-2
          "
          >
            {!!privateWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Private</p>
                <hr></hr>
                {privateWorkspaces.map((option) => (
                  <SelectedWorkspace
                    key={option.id}
                    workspace={option}
                    onClick={handleSelect}
                  />
                ))}
              </>
            )}
            {!!sharedWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Shared</p>
                <hr></hr>
                {sharedWorkspaces.map((option, index) => (
                  <SelectedWorkspace
                    key={index}
                    workspace={option}
                    onClick={handleSelect}
                  />
                ))}
              </>
            )}
            {!!collaboratingWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Shared</p>
                <hr></hr>
                {collaboratingWorkspaces.map((option) => (
                  <SelectedWorkspace
                    key={option.id}
                    workspace={option}
                    onClick={handleSelect}
                  />
                ))}
              </>
            )}

            <CustomDialogTrigger
              header="Create A Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you power to organise and collaborate"
            >
              <div
                className="
                flex
                transition-all
                justify-center
                items-center
                gap-2
                p-2
                w-full
                hover:bg-muted
                "
              >
                <article
                  className="flex
                  items-center
                  justify-center
                  w-4
                  h-4
                  bg-primary
                  text-white
                  rounded-full
                  pb-[5px]
                  "
                >
                  +
                </article>
                Create Workspace
              </div>
            </CustomDialogTrigger>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default WorkspaceDropdown
