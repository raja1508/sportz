export function SectionDivider({ style }: { style?: React.CSSProperties }) {
    return (
      <div
        style={{
          height: 1,
          background: "#F3F4F6",
          margin: "14px 0",
          ...style,
        }}
      />
    );
  }