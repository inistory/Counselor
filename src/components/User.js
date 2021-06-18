import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  FormControl,
  Radio,
  OutlinedInput,
  InputLabel,
} from "@material-ui/core";
import Swal from "sweetalert2";

export default function User(props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
  };

  const checkName = () => {
    let checkNum = /[0-9]/;
    let checkSpc = /[~!@#$%^&*()_+|<>?:{}]/;
    let checkKor = /([^가-힣\x20])/;
    let checkEng = /[a-zA-Z]/;

    if (checkSpc.test(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "특수기호는 이름에서 제외하여 주세요!",
      });
    } else if (!checkEng.test(name) && checkKor.test(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "자음과 모음을 조합하여 주세요!",
      });
    } else if (checkEng.test(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "한글이름을 입력해주세요!",
      });
    } else if (checkNum.test(name)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "숫자가 입력되었습니다!",
      });
    } else {
      props.history.push({
        pathname: "/example",
        state: { userName: name, userGender: gender },
      });
    }
  };

  return (
    <Box style={{ width: "100%" }}>
      <Grid container justify="center">
        <h1>직업 가치관 검사</h1>

        <Grid container justify="center">
          <FormControl variant="outlined">
            <InputLabel htmlFor="component-outlined">이름</InputLabel>
            <OutlinedInput
              id="component-outlined"
              value={name}
              onChange={onChangeName}
              label="Name"
            />
            <Grid container justify="center">
              <FormControlLabel
                value="100324"
                control={<Radio color="primary" />}
                label="여성"
                checked={gender === "100324" ? true : false}
                onChange={onChangeGender}
              />
              <FormControlLabel
                value="100323"
                control={<Radio color="primary" />}
                label="남성"
                checked={gender === "100323" ? true : false}
                onChange={onChangeGender}
              />
            </Grid>
          </FormControl>
        </Grid>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={name == "" || gender == "" ? true : false}
            variant="contained"
            color="primary"
            onClick={checkName}
          >
            검사 시작
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}
