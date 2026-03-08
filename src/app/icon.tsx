import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: "#141210",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#E8845A",
                    fontWeight: 900,
                    fontFamily: "monospace",
                    border: "2px solid #F0EBE3"
                }}
            >
            //
            </div>
        ),
        {
            ...size,
        }
    );
}
