import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Grid } from "@material-ui/core";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function Result(props) {
  const [graphdata, setGraphdata] = useState([]); //전체 데이터
  const [name, setName] = useState([{}]); //이름
  const [gender, setGender] = useState([{}]); //성별
  const [date, setDate] = useState([{}]); //검사일
  const [score, setScore] = useState([]); //검사결과

  const [major, setMajor] = useState([[], [], [], [], [], [], [], []]);
  const [edulevel, setEdulevel] = useState([[], [], [], [], []]); //학력별
  const [realgraphdata, setRealgraphdata] = useState([]);

  const [edutable, setEdutable] = useState([]);
  const [majortable, setMajortable] = useState([]);

  const seq = props.location.state.url.split("=")[1];
  const url = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=${seq}`;
  const item = [
    "능력발휘",
    "자율성",
    "보수",
    "안정성",
    "사회적 안정",
    "사회봉사",
    "자기계발",
    "창의성",
  ];
  const edulevellist = ["중졸", "고졸", "전문대졸", "대졸", "대학원졸"];
  const majorlist = [
    "계열무관",
    "인문",
    "사회",
    "교육",
    "공학",
    "자연",
    "의학",
    "예능",
  ];

  const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
    tablecell: {
      minWidth: 80,
    },
    container: {
      borderRadius: 5,
    },
    bigIndicator: { backgroundColor: "#ffff" },
  });

  const useStyles2 = makeStyles((theme) => ({
    root: {
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
    appbar: {
      borderRadius: 5,
    },
    bar: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 5,
    },
  }));
  const classes = useStyles();
  const classes2 = useStyles2();
  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //결과 요청
  async function fetchResult() {
    const response = await axios.get(url);

    setName(response.data.user.name);
    setGender(response.data.user.grade);
    setDate(response.data.inspct.beginDtm.slice(0, 10));
    setScore(response.data.result.wonScore.split(" "));
  }
  useEffect(() => {
    fetchResult();
  }, []);

  useEffect(() => {
    let scoreArr = [];

    score.map((sc, idx) => {
      if (sc !== "") {
        scoreArr.push({ item: item[idx], score: sc.split("=")[1] });
      }
    });
    scoreArr.splice(8, 1);
    setGraphdata(scoreArr);
  }, [score]);

  useEffect(() => {
    let temp = [];

    if (graphdata !== " " && graphdata != null) {
      graphdata.map((data, idx) => {
        temp.push({
          subject: data.item,
          A: data.score,
          B: 110,
          fullMark: 150,
        });
      });
      setRealgraphdata(temp);
    }
  }, [graphdata]);

  const onChangePage = () => {
    props.history.push("/");
  };

  //학력별 직업 요청
  async function fetchEduInfo(top1, top2) {
    let temp = [[], [], [], [], []];

    const education = await axios.get(
      `https://inspct.career.go.kr/inspct/api/psycho/value/jobs?no1=${top1}&no2=${top2}`
    );
    education.data.map((edu, idx) => {
      temp[edu[2] - 1].push({ id: edu[0], job: edu[1] });
    });

    setEdulevel(temp);
  }

  //전공별 직업 요청
  async function fetchMajorInfo(top1, top2) {
    let temp = [[], [], [], [], [], [], [], []];

    const majorInfo = await axios.get(
      `https://inspct.career.go.kr/inspct/api/psycho/value/majors?no1=${top1}&no2=${top2}`
    );

    majorInfo.data.map((major, idx) => {
      temp[major[2]].push({ id: major[0], major: major[1] });
    });

    setMajor(temp);
  }

  useEffect(() => {
    if (graphdata[0]) {
      let temp = graphdata;
      temp.sort(function (a, b) {
        return b["score"] - a["score"];
      });

      fetchEduInfo(
        item.indexOf(temp[0].item) + 1,
        item.indexOf(temp[1].item) + 1
      );
      fetchMajorInfo(
        item.indexOf(temp[0].item) + 1,
        item.indexOf(temp[1].item) + 1
      );
    }
  }, [graphdata]);

  //학력별 직업정보 가공
  function createData(edulevel) {
    let temp = [];

    edulevel.map((edu, idx) => {
      var tmpjob = [];

      edu.map((ed, idx2) => {
        var url =
          "https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=" +
          ed.id;

        tmpjob.push({ jobname: ed.job, url: url });
      });

      temp.push({ id: edulevellist[idx], jobs: tmpjob });
    });

    setEdutable(temp);
  }
  useEffect(() => {
    if (edulevel[1]) {
      createData(edulevel);
    }
  }, [edulevel]);

  //전공별 직업정보 가공
  function createMayor(major) {
    let temp = [];

    major.map((edu, idx) => {
      var tmpjob = [];

      edu.map((ed, idx2) => {
        var url =
          "https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ=" +
          ed.id;

        tmpjob.push({ jobname: ed.major, url: url });
      });

      temp.push({ id: majorlist[idx], jobs: tmpjob });
    });

    setMajortable(temp);
  }
  useEffect(() => {
    if (major[1]) {
      createMayor(major);
    }
  }, [major]);

  return (
    <Grid container justify="center">
      <Typography className={classes2.root}>
        <Grid container justify="center">
          <h1>직업 가치관 검사 결과표</h1>
        </Grid>
        <div>
          <Grid container justify="center">
            <Box
              style={{
                padding: "3% 26%",
                backgroundColor: "#F7F7F7",
                margin: "8px 0px",
                borderRadius: 4,
                boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Grid container justify="center">
                <Box>
                  <p>
                    직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의
                    믿음과 신념입니다.
                    <br />
                    따라서 여러분의 직업생활과 관련하여 <br />
                    포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다.{" "}
                    <br /> 직업가치관검사는 여러분이 직업을 선택할 때 상대적으로
                    어떠한 가치를 중요하게 생각하는지를 알려줍니다. <br /> 또한
                    본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는
                    직업에 대해 생각해 볼 기회를 제공합니다.
                  </p>
                </Box>

                <div>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes2.appbar}
                      className={classes.table}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">이름</TableCell>
                          <TableCell align="center">성별</TableCell>
                          <TableCell align="center">검사일</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={JSON.stringify(name).replace(/"/gi, "")}>
                          <TableCell component="th" align="center">
                            {JSON.stringify(name).replace(/"/gi, "")}
                          </TableCell>
                          <TableCell align="center">
                            {JSON.stringify(gender).replace(/"/gi, "") ===
                            "100323"
                              ? "남성"
                              : "여성"}
                          </TableCell>
                          <TableCell align="center">
                            {JSON.stringify(date).replace(/"/gi, "")}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>

              <Grid container justify="center">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  width={500}
                  height={500}
                  data={realgraphdata}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Mike"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    s
                  />
                </RadarChart>
              </Grid>

              <div>
                <div className={classes2.bar}>
                  <AppBar className={classes2.appbar} position="static">
                    <Tabs
                      className={{ indicator: classes.bigIndicator }}
                      value={value}
                      onChange={handleChange}
                      aria-label="wrapped label tabs example"
                    >
                      <Tab
                        value="one"
                        label="종사자 평균 전공별"
                        {...a11yProps("two")}
                      />
                      <Tab
                        value="two"
                        label="종사자 평균 학력별"
                        {...a11yProps("one")}
                      />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index="two">
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tablecell}
                              // align="center"
                            >
                              분야
                            </TableCell>
                            <TableCell>직업</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {edutable.map((row) => (
                            <TableRow align="left" key={row.id}>
                              <TableCell component="th" scope="row">
                                {row.id}
                              </TableCell>
                              <TableCell align="left">
                                {row.jobs.map((job) => {
                                  return (
                                    <Link href={job.url}>
                                      {job.jobname + " "}{" "}
                                    </Link>
                                  );
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel value={value} index="one">
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tablecell}>
                              분야
                            </TableCell>
                            <TableCell align="left">직업</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {majortable.map((row) => (
                            <TableRow align="left" key={row.id}>
                              <TableCell component="th" scope="row">
                                {row.id}
                              </TableCell>
                              <TableCell align="left">
                                {row.jobs.map((job) => {
                                  return (
                                    <Link href={job.url}>
                                      {job.jobname + " "}{" "}
                                    </Link>
                                  );
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                </div>
              </div>

              <Grid container justify="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onChangePage}
                >
                  다시 검사하기
                </Button>
              </Grid>
            </Box>
          </Grid>
        </div>
      </Typography>
    </Grid>
  );
}
