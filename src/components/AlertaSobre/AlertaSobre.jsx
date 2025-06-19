import { useState } from "react";
import { Alert, Button } from "react-bootstrap";

const AlertaSobre = (props) => {
    const [show, setShow] = useState(props.verificacao);

    if (show) {
        return (
            <div style={{
                width: "100%",
                height: "100vh",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignContent: "center"
            }}>
                <Alert
                    style={{
                        position: "absolute",
                        border: "solid blue 1px"
                    }}
                    variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{props.title}</Alert.Heading>
                    <p>
                        {props.text}
                    </p>
                </Alert>
            </div>
        );
    }
    // return <Button
    // style={{
    //     marginTop: "100px"
    // }}
    // onClick={() => setShow(true)}>Show Alert</Button>;
}

export default AlertaSobre