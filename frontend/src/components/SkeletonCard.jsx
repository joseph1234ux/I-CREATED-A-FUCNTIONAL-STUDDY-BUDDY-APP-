const SkeletonCard = () => {
  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid #e2e8f0",
      animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "12px",
      }}>
        <div style={{
          width: "80px",
          height: "24px",
          background: "#e2e8f0",
          borderRadius: "12px",
        }} />
        <div style={{
          width: "50px",
          height: "24px",
          background: "#e2e8f0",
          borderRadius: "6px",
        }} />
      </div>
      
      <div style={{
        width: "80%",
        height: "24px",
        background: "#e2e8f0",
        borderRadius: "6px",
        marginBottom: "8px",
      }} />
      
      <div style={{
        width: "60%",
        height: "16px",
        background: "#e2e8f0",
        borderRadius: "6px",
        marginBottom: "16px",
      }} />
      
      <div style={{
        display: "flex",
        gap: "8px",
        borderTop: "1px solid #e2e8f0",
        paddingTop: "16px",
      }}>
        <div style={{
          width: "60px",
          height: "32px",
          background: "#e2e8f0",
          borderRadius: "6px",
        }} />
        <div style={{
          width: "60px",
          height: "32px",
          background: "#e2e8f0",
          borderRadius: "6px",
        }} />
      </div>
    </div>
  );
};

export default SkeletonCard;