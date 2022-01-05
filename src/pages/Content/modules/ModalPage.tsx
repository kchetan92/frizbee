import React from "react";
import styled from "styled-components";

const Container = styled.div`
* {
    all:initial
}
:root {
    --grey8: #1f1f1f
}

height: 300px;
width: 200px;
position: fixed;
top: 10px;
right: 10px;
z-index: 300;

img {
    width: 100%;
    height: auto;
}

.hide {
    opacity: 0;
}`

export const ModalPage = () => {
    return <Container className="modal">
        <p>Hello!!!</p>
        <p>Last picture:</p>
        <img id="last-pic" src="" />
        <p id="image-count">Image count: 0</p>
    </Container>
}