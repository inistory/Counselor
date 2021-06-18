import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  FormControl,
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
    backgroundColor: "#3f51b5;",
  },
}))(LinearProgress);

export default function Test(props) {
  const [data, setData] = useState([{}]); //전체 데이터
  const [page, setPage] = useState(0); //페이지
  const [response, setResponse] = useState([]);
  const [pageQuestions, setPageQuestions] = useState([]); //현재 페이지에 필요한 네 개의 문항을 저장하는 state
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  function fetchData() {
    axios
      .get(
        "http://www.career.go.kr/inspct/openapi/test/questions?apikey=PUT_API_KEY_HERE"
      )
      .then((response) => {
        const data = response.data.RESULT;
        setData(data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      let resArr = [];
      data.map(() => {
        resArr.push("");
      });
      setResponse(resArr);
    }
  }, [data]);

  useEffect(() => {
    //page 가 바뀔 때 pageQuestions 를 page 에 알맞게 설정
    //예) page 가 1 이라면, 5 ~ 8 번째 문항을 pageQuestions 에 저장
    setPageQuestions(data.slice(page * 4, page * 4 + 4));
  }, [page, data]);

  // radio 버튼을 눌러 값을 변경했을 때 response 에 해당 값을 저장하는 함수
  const onChangeResponse = (e, idx) => {
    // 현재의 respone를 임시로 저장하는 prevArray 를 선언
    const prevArray = response;
    // prevArray 에서 idx (radio 버튼에 해당하는 문항 번호)에 해당하는 원소를 radio의 value로 바꿔주고, 임시로 newArray 에 저장
    //         prevArray                                      newArray
    // ["", "", "", "", ... , "", ..., ""] => ["", "", "", "", ... , "radio 버튼의 value", ..., ""]
    //   0   1   2   3  ...   idx ...  27      0   1   2   3  ...            idx          ...  27

    const newArray = [
      ...prevArray.slice(0, idx),
      e.target.value,
      ...prevArray.slice(idx + 1, prevArray.length),
    ];
    // newArray 를 response 에 적용
    setResponse(newArray);
    let cnt = 0;
    newArray.map((arry, idx) => {
      if (arry != "") {
        cnt += 1;
      }
    });

    setProgress((cnt / 28) * 100);
  };

  //현재 페이지에 해당하는 네 개의 문항을 prop로 전달받아서 가져오는 컴포넌트
  //questions 는 컴포넌트에서 출력할 4개의 문항을 리스트로 받아오는 props
  const Questions = ({ questions }) => {
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
      //response 가 바뀔 때(문항을 선택할 때)마다 현재 페이지에 해당하는 4개의 문항에 대해 모두 선택이 되어있는지를 검사
      checkAllChecked();
    }, [response]);

    //현재 페이지에 해당하는 4개의 문항에 대해 모두 선택이 되어있는지를 검사
    const checkAllChecked = () => {
      //response 에서 현재 페이지에 해당하는 4개의 문항을 리스트로 받아 temp에 임시로 저장
      const temp = response.slice(page * 4, page * 4 + 4);
      //temp 에 있는 네 개의 문항을 검사하여 ""(빈 문자열)이 하나라도 존재하면 buttonDisabled 에 true 를 저장
      setButtonDisabled(temp.indexOf("") == -1 ? false : true);
    };

    //questions: 현재 페이지에 해당하는 네 문항
    //question: 그 중 한 문항
    return (
      <Box style={{ width: "100%" }}>
        <h1>검사 진행</h1>

        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="h5" color="textSecondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
        <Box minWidth={110}>
          <BorderLinearProgress variant="determinate" value={progress} />
        </Box>

        {/* 출력할 4개의 문항을 담고 있는 리스트인 questions 를 mapping 하여 하나씩 출력 */}
        {/* question 은 리스트 중에서 하나의 문항을 의미 */}
        {/* idx 는 questions 를 mapping 할 때 순서를 담고 있음 */}
        {questions.map((question, idx) => {
          return (
            <Box
              style={{
                padding: "12px 80px",
                backgroundColor: "#F7F7F7",
                margin: "8px 0px",
                borderRadius: 4,
                boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
              }}
            >
              <FormControl style={{ width: "100%" }} component="fieldset">
                <RadioGroup row name={question.qitemNo}>
                  <Grid container justify="center">
                    <div>{question.question}</div>
                    <Grid container justify="center">
                      <FormControlLabel
                        value={question.answerScore01}
                        control={<Radio color="primary" />}
                        label={question.answer01}
                        onChange={(e) => {
                          onChangeResponse(e, page * 4 + idx);
                        }}
                        checked={
                          // response 에 현재 해당하는 문항의 값이 현재 선택지와 일치한다면 checked 를 true로 설정
                          // idx 는 단순 현재 페이지에서 몇 번째에 해당하는 문항인지를 의미
                          // page * 4 를 더해줌으로써 실제 문항의 수와 일치하게 만들어줌
                          // 예) 3페이지의 3번째 문항 = 2 * 4 + 3 = 11번째 문항
                          response[page * 4 + idx] == question.answerScore01
                            ? true
                            : false
                        }
                      />
                      <FormControlLabel
                        value={question.answerScore02}
                        control={<Radio color="primary" />}
                        label={question.answer02}
                        onChange={(e) => {
                          onChangeResponse(e, page * 4 + idx);
                        }}
                        checked={
                          response[page * 4 + idx] == question.answerScore02
                            ? true
                            : false
                        }
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Box>
          );
        })}
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          {page === 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={onPrevExample}
              visibility="hidden"
            >
              이전
            </Button>
          )}
          {page !== 0 && (
            <Button variant="contained" color="primary" onClick={onPrevPage}>
              이전
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={buttonDisabled}
            onClick={onChangePage}
          >
            {page == 6 ? "제출" : "다음"}
          </Button>
        </Box>
      </Box>
    );
  };

  //페이지 증가
  const onChangePage = () => {
    if (page == 6) {
      postData();
    } else {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    if (url != "") {
      props.history.push({
        pathname: "/end",
        state: {
          url: url,
        },
      });
    }
  }, [url]);
  //페이지 감소
  const onPrevPage = () => {
    setPage(page - 1);
  };

  //검사예시 페이지로
  const onPrevExample = () => {
    props.history.push({
      pathname: "/",
    });
  };
  async function postData() {
    let answer = "";
    response.map((res, idx) => {
      if (idx == 27) {
        answer += "B" + (idx + 1) + "=" + res;
      } else {
        answer += "B" + (idx + 1) + "=" + res + " ";
      }
    });

    let results = {
      apikey: PUT_API_KEY_HERE,
      qestrnSeq: "6",
      trgetSe: "100208",
      name: props.location.state.userName,
      gender: props.location.state.userGender,
      school: "",
      grade: "",
      email: "",
      startDtm: String(new Date().getTime()),
      answers: answer,
    };

    const post_contents = await axios.post(
      "https://www.career.go.kr/inspct/openapi/test/report",
      JSON.stringify(results),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setUrl(post_contents.data.RESULT.url);
  }

  return (
    <>
      <Container maxWidth="md">
        <Grid container justify="center">
          <Questions questions={pageQuestions} />
        </Grid>
      </Container>
    </>
  );
}
