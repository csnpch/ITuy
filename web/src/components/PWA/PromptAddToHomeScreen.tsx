import * as React from "react";
import { useAddToHomescreenPrompt } from "./useAddToHomescreenPrompt";

export default function PromptAddToHomeScreen() {
    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
    const [isVisible, setVisibleState] = React.useState(false);

    const hide = () => setVisibleState(false);

    React.useEffect(
        () => {
            if (prompt) {
                setVisibleState(true);
            }
        },
        [prompt]
    );

    if (!isVisible) {
        return <div />;
    }

    return (
        <>
            <div onClick={hide}>
                <button onClick={hide}>Close</button>
                Hello! Wanna add to homescreen?
                <button onClick={promptToInstall}>Add to homescreen</button>
            </div>
        </>
    );
}