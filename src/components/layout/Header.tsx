

const Header = () => {
  return (
    <div style={headerStyles.shell} >
        <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">Sportz</span>
            <span className="text-sm tracking-tighter font-semibold">Real time match data</span>
        </div>
        <div className="flex gap-2 items-center" style={headerStyles.tag}>
            <div className="w-3 h-3 bg-green-400 border-2 border-gray-500 rounded-full"></div>
            <span className="uppercase font-semibold text-sm">live connected</span>
        </div>
    </div>
  )
}

export default Header

const headerStyles: Record<string, React.CSSProperties> = {
    shell: {
        background: "#FCDA3D",
        border: "2px solid #1f1f1f",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        minHeight: "80px",
        boxShadow :
      ` 1px 1px 0 #1F1F1F,
        2px 2px 0 #1F1F1F,
        3px 3px 0 #1F1F1F,
        4px 4px 0 #1F1F1F,
        2px 2px 0 #1F1F1F,
        3px 3px 0 #1F1F1F
        `,
        padding:"0px 20px",
        justifyContent: "space-between",
        alignItems: "center"
      },

    tag: {
        background: "#fefefe",
        border: "2px solid #1f1f1f",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        padding: "2px 4px", 
        boxShadow :
      ` 1px 1px 0 #1F1F1F,
        2px 2px 0 #1F1F1F,
        3px 3px 0 #1F1F1F,
        4px 4px 0 #1F1F1F,
        3px 3px 0 #1F1F1F,
        4px 4px 0 #1F1F1F
        `
    }
}