import React from "react";
import styled from "styled-components";

const Title = styled.div`
  background-color: #99e2ef;
  color: white;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  padding: 20px 0;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  color: white;
`;

const Label = styled.div`
  border: 1px solid #99e2ef;
  background-color: #99e2ef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 150px;
  height: 50px;
  margin: 30px; 0 0 20px;
`;

const App = () => {
  return (
    <div className="App">
      <Title>
        <h1>RESAS APP</h1>
      </Title>
      <Container>
        <Label>都道府県</Label>
      </Container>
    </div>
  );
};

export default App;
