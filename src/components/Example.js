import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  Grid,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

export default function Example(props) {
  const [test, setTest] = useState("");

  const onChangeTest = (e) => {
    setTest(e.target.value);
  };

  const startTest = () => {
    props.history.push({
      pathname: "/test",
      state: {
        userName: props.location.state.userName,
        userGender: props.location.state.userGender,
      },
    });
  };

  return (
    <>
      <Container maxWidth="md">
        <Grid container justify="center">
          <Box style={{ width: "100%" }}>
            <h1>검사예시</h1>
            <Box style={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="h5" color="textSecondary">
                {" "}
                {`${Math.round(0)}%`}
              </Typography>
            </Box>
            <Box minWidth={110}>
              <BorderLinearProgress variant="determinate" value={0} />
            </Box>

            <Box
              style={{
                padding: "12px 80px",
                backgroundColor: "#F7F7F7",
                margin: "8px 0px",
                borderRadius: 4,
                boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container justify="center">
                <div>
                  두 개의 가치 중에 자신에게 더 중요한 가치를 선택하세요.
                </div>
              </Grid>
              <Grid container justify="center">
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="능력발휘"
                  checked={test === "1" ? true : false}
                  onChange={onChangeTest}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="primary" />}
                  label="자율성"
                  checked={test === "2" ? true : false}
                  onChange={onChangeTest}
                />
              </Grid>
            </Box>

            <Grid container justify="center">
              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  disabled={test === "" ? true : false}
                  variant="contained"
                  color="primary"
                  onClick={startTest}
                >
                  검사 시작
                </Button>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Container>
    </>
  );
}
