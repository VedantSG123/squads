"use client"
import { useAppState } from "@/lib/providers/state-provider"
import { workspace } from "@/lib/supabase/supabase.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

type SelectedWorkspaceProps = {
  workspace: workspace
  onClick?: (option: workspace) => void
}

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({
  workspace,
  onClick,
}) => {
  const supabase = createClientComponentClient()
  const [workspaceLogo, setWorkspaceLogo] = useState("/Images/collab_craft.png")

  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(workspace.logo)?.data.publicUrl

      setWorkspaceLogo(path)
    }
  }, [workspace])

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace)
      }}
      className="flex 
        rounded-md 
        hover:bg-muted 
        transition-all 
        flex-row
        p-2
        gap-4
        justify-center
        cursor-pointer
        items-center
        my-2
      "
    >
      <Image
        src={workspaceLogo}
        alt="workspace logo"
        width={26}
        height={26}
        style={{ objectFit: "cover" }}
      />
      <p
        className="text-lg 
            w-[170px] 
            overflow-hidden 
            overflow-ellipsis 
            whitespace-nowrap
          "
      >
        {workspace.title}
      </p>
    </Link>
  )
}

export default SelectedWorkspace
