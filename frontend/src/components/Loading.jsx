const Loading = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "300px",
      padding: "40px 20px",
    }}>
      <div style={{
        width: "50px",
        height: "50px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #4f46e5",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      
      <p style={{
        marginTop: "16px",
        color: "#64748b",
        fontSize: "16px",
        fontWeight: "500",
      }}>
        Loading...
      </p>
    </div>
  );
};

export default Loading;