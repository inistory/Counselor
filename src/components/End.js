import React from "react";
import { Box, Button, Grid, FormControl } from "@material-ui/core";

export default function End(props) {
  const onChangepage = () => {
    props.history.push({
      pathname: "/result",
      state: {
        url: props.location.state.url,
      },
    });
  };

  return (
    <Grid container justify="center">
      <Grid container justify="center">
        <div>
          <h1>검사 완료</h1>
        </div>
      </Grid>
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
          <Grid container justify="center">
            <FormControl variant="outlined">
              <p>
                검사가 완료되었습니다.
                <br />
                <p>
                  검사 결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를
                  중요하게 생각하는지 알려주고, <br />
                  중요 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를
                  제공합니다.
                </p>{" "}
              </p>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Grid container justify="center">
        <Button onClick={onChangepage} variant="contained" color="primary">
          결과 보기
        </Button>
      </Grid>
    </Grid>
  );
}
