export const LoadingIndicator = () => (
    <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.71)",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        display: "flex",
        top: 0,
        left: 0,
        zIndex: 1000
    }}>
        <p style={{
            textAlign: "center",
            fontSize: "20px",
            color: "Black"
        }}>
            (API is being called... Table is in Loading state)
        </p>
    </div>
);