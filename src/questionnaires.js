import React, { Component } from 'react';
import * as Survey from 'survey-react';
import Button from 'react-bootstrap/Button'
import { API_URL } from './config';
import 'survey-react/survey.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/umd/popper.js';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css'
import './style/questionnaires.css';
import 'react-showdown';
import './style/intro.css';

class Questionnaires extends Component {

  constructor(props) {
    super(props);

    var user_info = this.props.location.state.user_info;
    var UserNo = this.props.location.state.UserNo;

    this.state = {
      user_info: user_info,
      UserNo:UserNo,
      transition: 0,
      resultAsString: {},
      QuestionnaireStartTime: '',
    };

    this.onCompleteComponent = this.onCompleteComponent.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(e) {

    var currentDate             = new Date();
    var QuestionnaireStartTime  = currentDate.toTimeString();

    setTimeout(
      function() {
        this.setState({
          transition: 1,
          QuestionnaireStartTime: QuestionnaireStartTime,
        });
      }
      .bind(this),
      100
    );

  }

  onCompleteComponent(survey) {

    var page = survey.currentPage;
    var RT_valueName = "PageNo" + (survey.pages.indexOf(page)+1);
    var seconds = Math.round(performance.now());
    var user_info = this.state.user_info;

    var currentDate   = new Date();
    var finishTime    = currentDate.toTimeString();

    user_info.QuestionnairesCompleted = 1;

    survey.setValue(RT_valueName, seconds);
    survey.setValue("Date", this.state.user_info.date)
    survey.setValue("QuestionnaireStartTime", this.state.QuestionnaireStartTime)
    survey.setValue("QuestionnaireFinishTime", finishTime)
    survey.setValue("UserStartTime", this.state.user_info.startTime)
    survey.setValue("ProlificID", this.state.user_info.prolific_id)

    var resultAsString = JSON.stringify(survey.data);

    this.setState({
      transition: 2,
      user_info: user_info,
      resultAsString: resultAsString
    });
  }

  timerCallback(survey){
    var page = survey.currentPage;
    var valueName = "PageNo" + survey.pages.indexOf(page);
    var seconds = Math.round(performance.now())
    survey.setValue(valueName, seconds);
  }

  sendQuestionnaires(user_no_){

    var resultAsString = this.state.resultAsString;

    //console.log("resultAsString", resultAsString)

    fetch(`${API_URL}/questionnaires_behaviour/` + user_no_, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: resultAsString
     })
  }

  componentDidMount() {
    Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
  }

  render() {

    var json = { title: "Form", showProgressBar: "top", pages: [

      // LSAS
      {questions: [
        {type: "matrixdropdown", name: "LSAS", horizontalScroll: true, columnMinWidth:"130px",
        isAllRowRequired: true,
        title: "Read each situation carefully and answer two questions about it; the first question asks how anxious or fearful you feel in the situation; the second question asks how often you avoid it. Please base your ratings on the way that situations have affected you in the last week.",
          columns: [
              { isRequired: true, name: "fear", title: "Anxiety", choices:[
                                                {"value": 0, "text": "None"},
                                                {"value": 1, "text": "Mild"},
                                                {"value": 2, "text": "Moderate"},
                                                {"value": 3, "text": "Severe"}]},
              { isRequired: true, name: "avoidance", title: "Avoidance", choices:[
                                                {"value": 0, "text": "Never"},
                                                {"value": 1, "text": "Occasionally"},
                                                {"value": 2, "text": "Often"},
                                                {"value": 3, "text": "Usually"}]},],
          rows: [
              { value: "LSAS_1",       text: "1. Telephone in public" },
              { value: "LSAS_2",       text: "2. Participating in small groups" },
              { value: "LSAS_3",       text: "3. Eating in public places" },
              { value: "LSAS_4",       text: "4. Drinking with others in public places" },
              { value: "LSAS_5",       text: "5. Talking to people in authority" },
              { value: "LSAS_6",       text: "6. Acting, performing or giving a talk in front of an audience" },
              { value: "LSAS_7",       text: "7. Going to a party" },
              { value: "LSAS_8",       text: "8. Working while being observed" },
              { value: "LSAS_9",       text: "9. Writing while being observed " },
              { value: "LSAS_10",      text: "10. Calling someone you don’t know very well " },
              { value: "LSAS_11",      text: "11. Talking with people you don’t know very well " },
              { value: "LSAS_12",      text: "12. Meeting strangers" },
              { value: "LSAS_13",      text: "13. Urinating in a public bathroom" },
              { value: "LSAS_14",      text: "14. Entering a room when others are already seated" },
              { value: "LSAS_15",      text: "15. Being the centre of attention" },
              { value: "LSAS_16",      text: "16. Speaking up at a meeting" },
              { value: "LSAS_17",      text: "17. Taking a test " },
              { value: "LSAS_18",      text: "18. Expressing a disagreement or disapproval to people you don’t know very well" },
              { value: "LSAS_19",      text: "19. Looking at people you don’t very well in the eyes" },
              { value: "LSAS_20",      text: "20. Giving a report to a group" },
              { value: "LSAS_21",      text: "21. Trying to pick up someone" },
              { value: "LSAS_22",      text: "22. Returning goods to a store " },
              { value: "LSAS_23",      text: "23. Giving a party" },
              { value: "LSAS_24",      text: "24. Resisting a high pressure salesperson" }
            ]
        }
      ]},

      // ASRS
      {questions: [
            { type: "matrix", name: "ASRS", isAllRowRequired: true,
            title: "Please indicate what best describes how you have felt and conducted yourself over the past 6 months. ",
                columns: [
                    { value: 1, text: "Never" },
                    { value: 2, text: "Rarely" },
                    { value: 3, text: "Sometimes" },
                    { value: 4, text: "Often" },
                    { value: 5, text: "Very Often" }],
                rows: [
                    { value: "ASRS_1",       text: "1. How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
                    { value: "ASRS_2",       text: "2. How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
                    { value: "ASRS_3",       text: "3. How often do you have problems remembering appointments or obligations?" },
                    { value: "ASRS_4",       text: "4. When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
                    { value: "ASRS_5",       text: "5. How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
                    { value: "ASRS_6",       text: "6. How often do you feel overly active and compelled to do things, like you were driven by a motor?" },
                    { value: "ASRS_7",       text: "7. How often do you make careless mistakes when you have to work on a boring or difficult project?" },
                    { value: "ASRS_8",       text: "8. How often do you have difficulty keeping your attention when you are doing boring or repetitive work?" },
                    { value: "ASRS_9",       text: "9. How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?" },
                    { value: "ASRS_10",      text: "10. How often do you misplace or have difficulty finding things at home or at work?" },
                    { value: "ASRS_11",      text: "11. How often are you distracted by activity or noise around you?" },
                    { value: "ASRS_12",      text: "12. How often do you leave your seat in meetings or other situations in which you are expected to remain seated?" },
                    { value: "ASRS_13",      text: "13. How often do you feel restless or fidgety?" },
                    { value: "ASRS_14",      text: "14. How often do you have difficulty unwinding and relaxing when you have time to yourself?" },
                    { value: "ASRS_15",      text: "15. How often do you find yourself talking too much when you are in social situations?" },
                    { value: "ASRS_16",      text: "16. When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?" },
                    { value: "ASRS_17",      text: "17. How often do you have difficulty waiting your turn in situations when turn taking is required?" },
                    { value: "ASRS_18",      text: "18. How often do you interrupt others when they are busy?" }
                  ]},
        ]},

      //BIS 11
      {questions: [
            { type: "matrix", name: "BIS11", isAllRowRequired: true,
              title: "People differ in the ways they act and think in different situations. This is a test to measure some of the ways in which you act and think. Do not spend too much time on any statement. Answer quickly and honestly.",
                columns: [
                    { value: 1, text: "Rarely/Never" },
                    { value: 2, text: "Occasionally" },
                    { value: 3, text: "Often" },
                    { value: 4, text: "Almost Always/Always" }],
                rows: [
                    { value: "BIS11_1",    text: "1. I plan tasks carefully." },
                    { value: "BIS11_2",    text: "2. I do things without thinking." },
                    { value: "BIS11_3",    text: "3. I make-up my mind quickly." },
                    { value: "BIS11_4",    text: "4. I am happy-go-lucky." },
                    { value: "BIS11_5",    text: "5. I don’t “pay attention.”" },
                    { value: "BIS11_6",    text: "6. I have “racing” thoughts." },
                    { value: "BIS11_7",    text: "7. I plan trips well ahead of time." },
                    { value: "BIS11_8",    text: "8. I am self controlled." },
                    { value: "BIS11_9",    text: "9. I concentrate easily." },
                    { value: "BIS11_10",   text: "10. I save regularly." },
                    { value: "BIS11_11",   text: "11. I “squirm” at plays or lectures." },
                    { value: "BIS11_12",   text: "12. I am a careful thinker." },
                    { value: "BIS11_13",   text: "13. I plan for job security." },
                    { value: "BIS11_14",   text: "14. I say things without thinking." },
                    { value: "BIS11_15",   text: "15. I like to think about complex problems." },
                    { value: "BIS11_16",   text: "16. I change jobs." },
                    { value: "BIS11_17",   text: "17. I act “on impulse.”" },
                    { value: "BIS11_18",   text: "18. I get easily bored when solving thought problems." },
                    { value: "BIS11_19",   text: "19. I act on the spur of the moment." },
                    { value: "BIS11_20",   text: "20. I am a steady thinker." },
                    { value: "BIS11_21",   text: "21. I change residences." },
                    { value: "BIS11_22",   text: "22. I buy things on impulse." },
                    { value: "BIS11_23",   text: "23. I can only think about one thing at a time." },
                    { value: "BIS11_24",   text: "24. I change hobbies." },
                    { value: "BIS11_25",   text: "25. I spend or charge more than I earn." },
                    { value: "BIS11_26",   text: "26. I often have extraneous thoughts when thinking." },
                    { value: "BIS11_27",   text: "27. I am more interested in the present than the future." },
                    { value: "BIS11_28",   text: "28. I am restless at the theater or lectures." },
                    { value: "BIS11_29",   text: "29. I like puzzles." },
                    { value: "BIS11_30",   text: "30. I am future oriented." }
                  ]},
        ]},

      //OCI-R
      {questions: [
              { type: "matrix", name: "OCIR", isAllRowRequired: true,
                title: "Indicated what best describes HOW MUCH each experience has DISTRESSED or BOTHERED you during the PAST MONTH.",
                  columns: [
                      { value: 0, text: "Not at all" },
                      { value: 1, text: "A little" },
                      { value: 2, text: "Moderately" },
                      { value: 3, text: "A lot" },
                      { value: 4, text: "Extremely" }],
                  rows: [
                      { value: "OCIR_1",    text: "1. I have saved up so many things that they get in the way." },
                      { value: "OCIR_2",    text: "2. I check things more often than necessary." },
                      { value: "OCIR_3",    text: "3. I get upset if objects are not arranged properly." },
                      { value: "OCIR_4",    text: "4. I feel compelled to count while I am doing things." },
                      { value: "OCIR_5",    text: "5. I find it difficult to touch an object when I know it has been touched by strangers or certain people." },
                      { value: "OCIR_6",    text: "6. I find it difficult to control my own thoughts." },
                      { value: "OCIR_7",    text: "7. I collect things I don’t need." },
                      { value: "OCIR_8",    text: "8. I repeatedly check doors, windows, drawers, etc." },
                      { value: "OCIR_9",    text: "9. I get upset if others change the way I have arranged things." },
                      { value: "OCIR_10",   text: "10. I feel I have to repeat certain numbers." },
                      { value: "OCIR_11",   text: "11. I sometimes have to wash or clean myself simply because I feel contaminated." },
                      { value: "OCIR_12",   text: "12. I am upset by unpleasant thoughts that come into my mind against my will." },
                      { value: "OCIR_13",   text: "13. I avoid throwing things away because I am afraid I might need them later." },
                      { value: "OCIR_14",   text: "14. I repeatedly check gas and water taps and light switches after turning them off." },
                      { value: "OCIR_15",   text: "15. I need things to be arranged in a particular way." },
                      { value: "OCIR_16",   text: "16. I feel that there are good and bad numbers." },
                      { value: "OCIR_17",   text: "17. I wash my hands more often and longer than necessary." },
                      { value: "OCIR_18",   text: "18. I frequently get nasty thoughts and have difficulty in getting rid of them." }
                    ]},
          ]},

      // IU
      {questions: [
            {   type: "matrix", name: "IUS", isAllRowRequired: true,
                title: "You will find below a series of statements which describe how people may react to the uncertainties of life. Please use the scale below to describe to what extent each item is characteristic of you.",
                columns: [
                    { value: 1, text: "1 - Not at all" },
                    { value: 2, text: "2" },
                    { value: 3, text: "3 - Somewhat" },
                    { value: 4, text: "4" },
                    { value: 5, text: "5 - Entirely" }
                  ],
                rows: [
                    { value: "IUS_1",   text: "1. Uncertainty stops me from having a firm opinion." },
                    { value: "IUS_2",   text: "2. Being uncertain means that a person is disorganized." },
                    { value: "IUS_3",   text: "3. Uncertainty makes life intolerable." },
                    { value: "IUS_4",   text: "4. It’s unfair not having any guarantees in life." },
                    { value: "IUS_5",   text: "5. My mind can’t be relaxed if I don’t know what will happen tomorrow." },
                    { value: "IUS_6",   text: "6. Uncertainty makes me uneasy, anxious, or stressed." },
                    { value: "IUS_7",   text: "7. Unforeseen events upset me greatly." },
                    { value: "IUS_8",   text: "8. It frustrates me not having all the information I need." },
                    { value: "IUS_9",   text: "9. Uncertainty keeps me from living a full life." },
                    { value: "IUS_10",  text: "10. One should always look ahead so as to avoid surprises." },
                    { value: "IUS_11",  text: "11. A small unforeseen event can spoil everything, even with the best of planning." },
                    { value: "IUS_12",  text: "12. When it’s time to act, uncertainty paralyses me." },
                    { value: "IUS_13",  text: "13. Being uncertain means that I am not first rate." },
                    { value: "IUS_14",  text: "14. When I am uncertain, I can’t go forward." },
                    { value: "IUS_15",  text: "15. When I am uncertain I can’t function very well." },
                    { value: "IUS_16",  text: "16. Unlike me, others always seem to know where they are going with their lives." },
                    { value: "IUS_17",  text: "17. Uncertainty makes me vulnerable, unhappy, or sad." },
                    { value: "IUS_18",  text: "18. I always want to know what the future has in store for me." },
                    { value: "IUS_19",  text: "19. I can’t stand being taken by surprise." },
                    { value: "IUS_20",  text: "20. The smallest doubt can stop me from acting." },
                    { value: "IUS_21",  text: "21. I should be able to organize everything in advance." },
                    { value: "IUS_22",  text: "22. Being uncertain means that I lack confidence." },
                    { value: "IUS_23",  text: "23. I think it’s unfair that other people seem sure about their future." },
                    { value: "IUS_24",  text: "24. Uncertainty keeps me from sleeping soundly." },
                    { value: "IUS_25",  text: "25. I must get away from all uncertain situations." },
                    { value: "IUS_26",  text: "26. The ambiguities in life stress me." },
                    { value: "IUS_27",  text: "27. I can’t stand being undecided about my future." }
                  ]},
        ]},

      // SDS
      {questions: [
            {   type: "matrix", name: "SDS", isAllRowRequired: true,
                title: "For each item below, please place a check the column which best describes how often you felt or behaved this way during the past several days",
                columns: [
                    { value: 1, text: "A little of the time" },
                    { value: 2, text: "Some of the time" },
                    { value: 3, text: "Good part of the time" },
                    { value: 4, text: "Most of the time" },
                  ],
                rows: [
                    { value: "SDS_1",   text: "1. I feel down-hearted and blue." },
                    { value: "SDS_2",   text: "2. Morning is when I feel the best." },
                    { value: "SDS_3",   text: "3. I have crying spells or feel like it." },
                    { value: "SDS_4",   text: "4. I have trouble sleeping at night." },
                    { value: "SDS_5",   text: "5. I eat as much as I used to." },
                    { value: "SDS_6",   text: "6. I still enjoy sex." },
                    { value: "SDS_7",   text: "7. I notice that I am losing weight." },
                    { value: "SDS_8",   text: "8. I have trouble with constipation." },
                    { value: "SDS_9",   text: "9. My heart beats faster than usual." },
                    { value: "SDS_10",  text: "10. I get tired for no reason." },
                    { value: "SDS_11",  text: "11. My mind is as clear as it used to be." },
                    { value: "SDS_12",  text: "12. I find it easy to do the things I used to." },
                    { value: "SDS_13",  text: "13. I am restless and can’t keep still." },
                    { value: "SDS_14",  text: "14. I feel hopeful about the future." },
                    { value: "SDS_15",  text: "15. I am more irritable than usual." },
                    { value: "SDS_16",  text: "16. I find it easy to make decisions." },
                    { value: "SDS_17",  text: "17. I feel that I am useful and needed." },
                    { value: "SDS_18",  text: "18. My life is pretty full." },
                    { value: "SDS_19",  text: "19. I feel that others would be better off if I were dead." },
                    { value: "SDS_20",  text: "20. I still enjoy the things I used to do." }
                  ]},
        ]},

      // STAI-Y2
      {questions: [
            {   type: "matrix", name: "STAI", isAllRowRequired: true,
                title: "Read each statement and then write the number in the blank at the end of the statement that indicates how you generally feel. There is no right or wrong answer. Do not spend too much time on any one statement but give the answer which seems to describe how you generally feel.",
                columns: [
                    { value: 1, text: "Almost Never" },
                    { value: 2, text: "Sometimes" },
                    { value: 3, text: "Often" },
                    { value: 4, text: "Almost Always" },
                  ],
                rows: [
                    { value: "STAI_21",   text: "1. I feel pleasant" },
                    { value: "STAI_22",   text: "2. I feel nervous and restless" },
                    { value: "STAI_23",   text: "3. I feel satisfied with myself" },
                    { value: "STAI_24",   text: "4. I wish I could be as happy as others seem to be" },
                    { value: "STAI_25",   text: "5. I feel like a failure" },
                    { value: "STAI_26",   text: "6. I feel rested" },
                    { value: "STAI_27",   text: "7. I am calm, cool, and collected" },
                    { value: "STAI_28",   text: "8. I feel that difficulties are piling up so that I cannot overcome them" },
                    { value: "STAI_29",   text: "9. I worry too much over something that really doesn’t matter" },
                    { value: "STAI_30",  text: "10. I am happy" },
                    { value: "STAI_31",  text: "11. I have disturbing thoughts" },
                    { value: "STAI_32",  text: "12. I lack self confidence" },
                    { value: "STAI_33",  text: "13. I feel secure" },
                    { value: "STAI_34",  text: "14. I make decision easily" },
                    { value: "STAI_35",  text: "15. I feel inadequate" },
                    { value: "STAI_36",  text: "16. I am content" },
                    { value: "STAI_37",  text: "17. Some unimportant thoughts runs through my mind and bothers me" },
                    { value: "STAI_38",  text: "18. I take disappointments so keenly that I can’t put them out of my mind" },
                    { value: "STAI_39",  text: "19. I am a steady person" },
                    { value: "STAI_40",  text: "20. I get in a state of tension or turmoil as I think over my recent concerns and interests" }
                  ]},
        ]},

      // IQ text
      {questions: [
            { type: "radiogroup", name: "IQ_1", isRequired: true,
                title: "What number is one fifth of one fourth of one ninth of 900?",
                //colCount: 4,
                choices: [
                  {value:1, text:"2"},
                  {value:2, text:"3"},
                  {value:3, text:"4"},
                  {value:4, text:"5"},
                  {value:5, text:"6"},
                  {value:6, text:"7"}
                ]},

            { type: "radiogroup", name: "IQ_2", //isRequired: true,
                title: "Zach is taller than Matt and Richard is shorter than Zach. Which of the following statements would be the most accurate?",
                choices: [
                  {value:1, text:"Richard is taller than Matt"},
                  {value:2, text:"Richard is shorter than Matt"},
                  {value:3, text:"Richard is as tall as Matt"},
                  {value:4, text:"It's impossible to tell"}
                ]},

            { type: "radiogroup", name: "IQ_3", //isRequired: true,
                title: "Joshua is 12 years old and his sister is three times as old as he. When Joshua is 23 years old, how old will his sister be?",
                choices: [
                  {value:1, text:"25"},
                  {value:2, text:"39"},
                  {value:3, text:"44"},
                  {value:4, text:"47"},
                  {value:5, text:"53"}
                ]},

            { type: "radiogroup", name: "IQ_4", //isRequired: true,
                title: "If the day after tomorrow is two days before Thursday then what day is it today?",
                choices: [
                  {value:1, text:"Friday"},
                  {value:2, text:"Monday"},
                  {value:3, text:"Wednesday"},
                  {value:4, text:"Saturday"},
                  {value:5, text:"Tuesday"},
                  {value:6, text:"Sunday"}
                ]},

            { type: "radiogroup", name: "IQ_5", //isRequired: true,
                title: "In the following alphanumeric series, what letter comes next? K N P S U ...?",
                choices: [
                  {value:1, text:"S"},
                  {value:2, text:"T"},
                  {value:3, text:"U"},
                  {value:4, text:"V"},
                  {value:5, text:"W"},
                  {value:6, text:"X"}
                ]},

            { type: "radiogroup", name: "IQ_6", //isRequired: true,
                title: "In the following alphanumeric series, what letter comes next? V Q M J H ...?",
                choices: [
                  {value:1, text:"E"},
                  {value:2, text:"F"},
                  {value:3, text:"G"},
                  {value:4, text:"H"},
                  {value:5, text:"I"},
                  {value:6, text:"J"}
                ]},

            { type: "radiogroup", name: "IQ_7", //isRequired: true,
                title: "In the following alphanumeric series, what letter comes next? I J L O S ...?",
                choices: [
                  {value:1, text:"T"},
                  {value:2, text:"U"},
                  {value:3, text:"V"},
                  {value:4, text:"X"},
                  {value:5, text:"Y"},
                  {value:6, text:"Z"}
                ]},

            { type: "radiogroup", name: "IQ_8", //isRequired: true,
                title: "In the following alphanumeric series, what letter comes next? Q S N P L ...?",
                choices: [
                  {value:1, text:"J"},
                  {value:2, text:"H"},
                  {value:3, text:"I"},
                  {value:4, text:"N"},
                  {value:5, text:"M"},
                  {value:6, text:"L"}
                ]},
        ]},

      // IQ images
      {questions: [
            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/mx45_q.png' width='230px'/></br></br></br> </td><img src='images_quest/mx45_a.png' width='460px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_1", isRequired: true,
              title: "Which figure fits into the missing slot?",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/mx46_q.png' width='230px'/></br></br></br> </td><img src='images_quest/mx46_a.png' width='460px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_2", isRequired: true,
              title: "Which figure fits into the missing slot?",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/mx47_q.png' width='230px'/></br></br></br> </td><img src='images_quest/mx47_a.png' width='460px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_3", isRequired: true,
              title: "Which figure fits into the missing slot?",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/mx55_q.png' width='230px'/></br></br></br> </td><img src='images_quest/mx55_a.png' width='460px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_4", isRequired: true,
              title: "Which figure fits into the missing slot?",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/rsd3_q.png' width='550px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_5", isRequired: true,
              title: "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"},
                {value:7, text:"G"},
                {value:8, text:"H"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/rsd4_q.png' width='550px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_6", isRequired: true,
              title: "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"},
                {value:7, text:"G"},
                {value:8, text:"H"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/rsd6_q.png' width='550px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_7", isRequired: true,
              title: "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"},
                {value:7, text:"G"},
                {value:8, text:"H"}
              ]},

            { type: "html",
              name: "info",
              html: "<table><body></br></br></br></br><img src='images_quest/rsd8_q.png' width='550px'/></body></table>"},
            { type: "radiogroup", name: "IQimage_8",  isRequired: true,
              title: "All the cubes above have a different image on each side. Select the choice that represents a rotation of the cube labeled X.",
              choices: [
                {value:1, text:"A"},
                {value:2, text:"B"},
                {value:3, text:"C"},
                {value:4, text:"D"},
                {value:5, text:"E"},
                {value:6, text:"F"},
                {value:7, text:"G"},
                {value:8, text:"H"}
              ]},

            ]},

    ]};

    if(this.state.transition===0){
      return(
        <div>
          <div className="IntroConsentText">
            <p><span className="bold">STUDY PART 2/2</span></p>
            Thank you for completing the game. Here is the 2nd part of the study in which we will ask you questions about reasoning and about yourself.
            Click the button when you are ready.
            <br/><br/>
            <div className="container">
                <div className="center">
                  <Button variant="outline-success" size="lg" onClick={this.handleClick}> Let&#39;s go ! </Button>
                </div>
            </div>
          </div>
        </div>
      );
    }

    else if(this.state.transition===1){
      return(
        <div>
          <div className="IntroConsentText">
            <p><span className="bold">STUDY PART 2/2</span></p>
            Please take your time to answer.
            <br/><br/>
            <Survey.Survey json={json} showCompletedPage={false} onComplete={this.onCompleteComponent} onCurrentPageChanged={this.timerCallback}/>
          </div>
        </div>
      );
    }

    else if(this.state.transition===2){

      console.log("JSON string",this.state.resultAsString);

      this.sendQuestionnaires(this.state.UserNo);

      this.props.history.push({
        pathname: `/End`,
        state: {user_info: this.state.user_info}
      })

      return null
    }
  }
}

export default Questionnaires;
