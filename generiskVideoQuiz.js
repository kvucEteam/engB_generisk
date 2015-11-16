//######################################################################################
//                              Video loader
//###################################################################################### 


// FALLBACK MARK 14:34 

var VideoObj = {};

var VideoClass = {
    startFrameTitle: null,
    startFrameText: null,
    startButtonTitle: null,
    EmbedURL: null,
    WatchURL: null,
    BasicYoutubeEmbedStr: 'https://www.youtube.com/embed/',
    BasicYoutubeWatchStr: 'https://www.youtube.com/watch?v=',
    DefaultNoVideoImg: 'images/no_video.jpg',
    DefaultStartFrameTitle: "Titel på introskærm",
    DefaultStartFrameText: "Tekst, der beskriver hvad quizzen går ud på",
    DefaultStartButtonTitle: "Start quiz",
    QustionObj: {},
    AddVideoProp: function(URL) {
        this.EmbedURL = URL;
    },
    DeleteSelections: function() {
        this.startFrameTitle = null;
        this.startButtonTitle = null;
        this.EmbedURL = null;
        $("#video_startFrameTitle").val("");
        $("#video_startFrameText").val("");
        $("#video_startButtonTitle").val("");
        $("#video_width").val("");
        $("#video_height").val("");
        $("#video_url").val("");
        $("#PlayerVideoView").attr("src", this.DefaultNoVideoImg);
    },
    LoadDefaultVideo: function() {
        this.startFrameTitle = "Game of Thrones";
        this.startButtonTitle = "Play the video";
        this.EmbedURL = this.BasicYoutubeEmbedStr + "4lIYv66vKGc";
        this.WatchURL = this.BasicYoutubeWatchStr + "4lIYv66vKGc";
        $("#video_startFrameTitle").val(this.DefaultStartFrameTitle);
        $("#video_startFrameText").val(this.DefaultStartFrameText);
        $("#video_startButtonTitle").val(this.DefaultStartButtonTitle);
        $("#video_width").val(this.Width);
        $("#video_height").val(this.Height);
        $("#video_url").val(this.EmbedURL);
    },
    LoadVideo: function() {
        this.startFrameTitle = $("#video_startFrameTitle").val();
        this.startFrameText = $("#video_startFrameText").val();
        this.startButtonTitle = $("#video_startButtonTitle").val();
        var TempURL = $("#video_url").val();
        this.EmbedURL = this.BasicYoutubeEmbedStr + this.ReturnYoutubeVidId(TempURL);
        this.WatchURL = this.BasicYoutubeWatchStr + this.ReturnYoutubeVidId(TempURL);
        $("#PlayerVideoView").attr("src", this.EmbedURL);
    },
    DisplayJsonML: function() {
        $("#output").html(JSON.stringify(this));
    },
    LoadDefaultNoVideoImgIfNoVideoIsChosen: function() {
        if ((this.EmbedURL === null) || (this.EmbedURL === "")) {
            $("#PlayerVideoView").prop('src', this.DefaultNoVideoImg);
        }
    },
    ReturnYoutubeVidId: function(url) {
        var UrlParts = (url.indexOf("?v=") !== -1) ? url.split("?v=") : url.split("/");
        return UrlParts[UrlParts.length - 1];
    }

};



//######################################################################################
//                              User interface
//###################################################################################### 

// Maaling af ordlaengder til inputfelter:
//
//          10        20        30        40        50        60        70        80        90        100  
// 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
// https://www.youtube.com/embed/4lIYv66vKGc
// Answer the questions in this video quiz xcvb dfgbn
// Note what happens as the film plays and try to answer the questions as the film plays and 
// Start quiz Start quiz dgr dgre
// (1) Note what happens as the film plays and try to answer the questions as the film plays and tryX. (2) Note what happens as the film plays and try to answer the questions as the film plays and tryX. (3) Note what happens as the film plays and try to answer the questions as the film plays and tryX. 
// (1) Note what happens as the film plays and try to

// maxlength="10"

// no_video.jpg  

// QuestionField
var QuestionField = '<div class="QuestionField">' +
    '<span class="QuestionLetter"></span>' +
    '<input type="text" class="TextField w50 mr25" placeholder="Skriv svarmulighed her" name="Question" maxlength="50"/>' +
    '<input type="checkbox" name="Csvar" class="Csvar"/>' +
    // '<a class="addfield ml10" href="#"> Tilf&oslash;j svarmulighed </a>' + 
    '<a class="removefield ml60" href="#"> slet </a>' +
    '</div>';

// EventForm  -  NOTE: "Event" er det tidligere "Runde"
var EventForm = '<form class="EventForm">' +
    '<div class="EventFormBkColor">' +
    '<b class="ml10"> Sæt 1</b>' +
    '<span class="QuestionWrapperButton">' +
    '<input type="radio" name="valg" value="RadioQuestion" checked="checked" /> Sp&oslash;rgsm&aring;l' +
    '<input type="radio" name="valg" value="RadioInformation" /> Information' +
    '</span>' +
    '<a class="removeform ml10 right btn btn-default usrbutton" href="#"> Fjern sæt </a>' +
    '<div class="clear"></div>' +
    '<textarea rows="4" class="EventQuestion TextField w50" name="EventQuestion" maxlength="300" placeholder="Her skriver du dit spørgsmål til kursisten (300 tegn)">' + 
    '</textarea>' +
    '<textarea rows="4" class="EventInfo TextField w50" name="EventInfo" maxlength="300" placeholder="Her skriver du en tekst til kursisten, der passer tile et specifikt stop (300 tegn)">' + 
    '</textarea>' +
    '<br/>' +
    '<div class="QuestionWrapper">' +
    '<div class="QFTheading left"> ANGIV SVARMULIGHEDER (maks 4 svar muligt) </div> <span class="QFAheading left"> KORREKT SVAR </span>' +
    '<div class="clear"></div>' +
    '<div class="QuestionFieldWrapper">' +
    QuestionField +
    QuestionField +
    '</div>' +
    'ANGIV FEEDBACK <span class="addfieldWrap"><a class="addfield ml10" href="#"> Tilføj svarmulighed </a><span> <br/>' +
    '<textarea rows="4" class="TextField w50" name="EventFeedback" placeholder="Giv feedback til kursisten"></textarea> <br/>' +
    '</div>' +
    '<a class="addform ml10 right btn btn-default usrbutton" href="#"> Tilføj sæt </a>' +
    '<div class="clear"></div>' +
    '</div>' +
    // '<a class="addform ml10 right btn btn-default usrbutton" href="#"> Tilføj sæt </a>' +
    // '<div class="clear"></div>' +
    '</form>';

// TimestampForm  -  NOTE: "Timestamp" er synonym med "Stop"
var TimeStampForm = '<div class="TimeStampForm">' +
    '<form class="class_TimeStampForm p10">' +
    '<b> STOP 1 : </b>' +
    // GenerateNumberSelect(0, 24, "tt", "SelectHour") + " : " +
    GenerateNumberSelect(0, 60, "mm", "minutter", "SelectMin") + " : " +
    GenerateNumberSelect(0, 60, "ss", "sekunder", "SelectSec") +
    // ' eller <input type="text" placeholder="tt:mm:ss" />' +
    '</form>' +
    '<a class="remove_TimeStampForm ml10 right btn btn-default usrbutton" href="#"> Fjern stop </a>' +
    '<div class="clear"></div>' +
    // '<a class="add_TimeStampForm ml10" href="#"> Tilf&oslash;j et ekstra stop </a> ' +
    EventForm +
    '</div>';


function InitHTML(Selector, HtmlToBeAdded) {
    $(Selector).append(HtmlToBeAdded);
    UpdateQuestionFieldLetters();
    // SetDualSwitchState(Selector + " .EventForm ");
}


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}


function UpdateNumbersInFormHeaders() {

    $(".class_TimeStampForm > b").each(function(index1, element1) {
        $(this).html("STOP " + (index1 + 1).toString() + " : ");
        var ParentObj = $(this).closest(".TimeStampForm");
        $(".EventForm > div > b", ParentObj).each(function(index2, element2) {
            $(this).html("Sæt " + (index2 + 1).toString());
        });
    });
}


function UpdateQuestionFieldLetters() {

    $(".EventForm").each(function(index1, element1) {
        $(".QuestionLetter", element1).each(function(index2, element2) {
            var Letter = String.fromCharCode(65 + index2);
            $(element2).html(Letter);
            console.log("index2 : " + index2 + ", Letter : " + Letter);
        });
    });
}


//================================

// IN USE:
// AddElementLast('.AddNewPageButton', '.DummyPage', '#DummyPageContainer', DummyPage, false);
function AddTimestampLast(Selector, TSelector, TSelectorParent, HtmlToBeAdded, Max, PagerSelector, PagerTargetSelectorChild, PagerCssId) {
    $(document).on('click', Selector, function(event) {
        event.preventDefault();
        var NextParent;
        var TSelectorParentObj = $(TSelectorParent);
        var TSelectorParentText = TSelectorParentObj.text();
        var NumOfSiblings = $(TSelector, TSelectorParentObj).siblings().length;
        console.log("NumOfSiblings : " + NumOfSiblings + ", TSelectorParentText : " + TSelectorParentText);
        if ((Max > NumOfSiblings) || (Max === false)) {
            $(TSelector, TSelectorParentObj).last().after(HtmlToBeAdded);
        } else {
            alert("Det største antal tilladte elementer er " + Max);
        }

        // The following lines "breaks" the generality of this function: 
        // UpdateNumbersInPages();
        // Pager("#PagerContainer", "#DummyPageContainer > div", "Pager");
        UpdateNumbersInFormHeaders();
        UpdateQuestionFieldLetters();
        Pager(PagerSelector, PagerTargetSelectorChild, PagerCssId);
        MarkFistAnswerAsCorrectIfNoneSelected(false);
    });
}

// IN USE:
// RemoveElement('.removePage', '.DummyPage', 1);
function RemoveTimestamp(Selector, TSelector, Min, PagerSelector, PagerTargetSelectorChild, PagerCssId) {
    $(document).on('click', Selector, function(event) {
        event.preventDefault();
        var ParentClassName = $(this).closest(TSelector).attr("class").split(" ")[0];
        console.log("----ParentClassName 1: " + ParentClassName);
        var NumOfParents = $(this).closest(TSelector).siblings("." + ParentClassName).length + 1;
        console.log("NumOfParents : " + NumOfParents + ", ParentClassName: " + ParentClassName);
        if ((Min < NumOfParents) || (Min === false)) {
            $(this).closest(TSelector).remove();
        } else {
            alert("Det mindste antal elementer skal være " + Min);
        }
        // The following lines "breaks" the generality of this function: 
        // UpdateNumbersInPages();
        // Pager("#PagerContainer", "#DummyPageContainer > div", "Pager");
        UpdateNumbersInFormHeaders();
        UpdateQuestionFieldLetters();
        Pager(PagerSelector, PagerTargetSelectorChild, PagerCssId);
        MarkFistAnswerAsCorrectIfNoneSelected(true);
    });
}


//================================

// IN USE:
// VIGTIGT: Chromium tillader ikke default argumentet Max at blive angivet som "Max = false". 
function AddElement(Selector, TSelector, HtmlToBeAdded, Max) {
    $(document).on('click', Selector, function(event) {
        event.preventDefault();
        var NextParent;
        var ParentClassName = $(this).closest(TSelector).attr("class");
        var NumOfParents = $(this).closest(TSelector).siblings("." + ParentClassName).length + 1;
        console.log("NumOfParents : " + NumOfParents + ", ParentClassName: " + ParentClassName);
        if ((Max > NumOfParents) || (Max === false)) {
            $(this).closest(TSelector).after(HtmlToBeAdded);

            // The following two lines "breaks" the generality of this function: 
            // NextParent = $(this).closest(TSelector).next();
            // CheckEventFormPosition(NextParent); // Sets the state: "radio button" or "checkbox".
        } else {
            alert("Det største antal tilladte elementer er " + Max);
        }

        // The following lines "breaks" the generality of this function: 
        UpdateNumbersInFormHeaders();
        UpdateQuestionFieldLetters();
        MarkFistAnswerAsCorrectIfNoneSelected(false);
        // if (Selector == ".add_TimeStampForm") {
        //     if (CheckTimeStopValues('Du forsøger nu at tilføje nu et ekstra "Stop"') == true){
        //         $(".TimeStampForm:last-child").remove();
        //     }
        // }
        // CheckInputValues(NextParent);
    });
}

// IN USE
//      AddLastElement('.addfield', '.QuestionField', '.EventForm', QuestionField, 4);
// VIGTIGT: Chromium tillader ikke default argumentet Max at blive angivet som "Max = false". 
function AddLastElement(Selector, TSelector, TSelectorParent, HtmlToBeAdded, Max) {
    $(document).on('click', Selector, function(event) {
        event.preventDefault();
        var NextParent;
        var TSelectorParentObj = $(this).closest(TSelectorParent);
        var NumOfSiblings = $(TSelector, TSelectorParentObj).siblings().length;
        console.log("NumOfSiblings : " + NumOfSiblings);
        if ((Max > NumOfSiblings) || (Max === false)) {
            $(TSelector, TSelectorParentObj).last().after(HtmlToBeAdded);

            // The following two lines "breaks" the generality of this function: 
            // NextParent = $(this).closest(TSelector).next();
            // CheckEventFormPosition(NextParent); // Sets the state: "radio button" or "checkbox".
        } else {
            alert("Det største antal tilladte elementer er " + Max);
        }

        // The following lines "breaks" the generality of this function: 
        UpdateNumbersInFormHeaders();
        UpdateQuestionFieldLetters();
        MarkFistAnswerAsCorrectIfNoneSelected(true);
    });
}

// IN USE:
// VIGTIGT: Chromium tillader ikke default argumentet Min at blive angivet som "Min = false". 
function RemoveElement(Selector, TSelector, Min) {
    $(document).on('click', Selector, function(event) {
        event.preventDefault();
        var ParentClassName = $(this).closest(TSelector).attr("class");
        var NumOfParents = $(this).closest(TSelector).siblings("." + ParentClassName).length + 1;
        console.log("NumOfParents : " + NumOfParents + ", ParentClassName: " + ParentClassName);
        if ((Min < NumOfParents) || (Min === false)) {
            $(this).closest(TSelector).remove();
        } else {
            alert("Det mindste antal elementer skal være " + Min);
        }

        UpdateNumbersInFormHeaders();
        UpdateQuestionFieldLetters();
        MarkFistAnswerAsCorrectIfNoneSelected(true);
    });
}


function MarkFistAnswerAsCorrectIfNoneSelected(UsrAlert){
    $(".EventForm").each(function(index1, element1) {
        var Csvar = false;
        var MaxNum; var FirstObj;
        $(".QuestionField", element1).each(function(index2, element2) {
            if (index2 === 0) FirstObj = $(">input[name='Csvar']", element2);
            if ($("input[name='Csvar']", element2).prop('checked')) Csvar = true;
            MaxNum = index2 + 1;
        });
        if (!Csvar) {
            if (UsrAlert) alert("Der skal som minimum være eet korrekt svar!");
            $(FirstObj, element1).prop('checked', true);
        }
        console.log("MarkFistAnswer - MaxNum : " + MaxNum + ", Csvar : " + Csvar);
    });
}


// VIGTIGT: Der er en bedre metode til at fylde variable ind i objekter - se: 
//          JQuerys funktion ".serializeArray()" :
//          http://api.jquery.com/serializearray/
function GetFormsData(Selector_FormContainer) {
    var JSONarray = [];
    var FormObj = {};
    $(Selector_FormContainer + " .TimeStampForm").each(function(index, element) {
        FormObj.Index = index; // Only for testing
        FormObj.TimeStamp = $(" form.class_TimeStampForm", this).serializeArray();
        console.log("element : " + $(" form.class_TimeStampForm", this).get(0).tagName);
        var EventFormArray = [];
        $(" form.EventForm", this).each(function(index2, element2) {
            EventFormArray.push($(element2).serializeArray());
        });
        FormObj.EventForm = EventFormArray;
        JSONarray.push(FormObj);
        console.log("FormObj : " + JSON.stringify(FormObj));
        FormObj = {};
    });
    console.log("JSONarray : " + JSON.stringify(JSONarray));

    return JSONarray;

    // $("#JsonOutput").html( JSON.stringify( JSONarray, null, 4 ) );
}


function CheckTimeStopValues(StartStr) {
    var NumOfTimestamps = $(".class_TimeStampForm").length;
    var TimestampObj = {};
    var Error = false;
    $(".class_TimeStampForm").each(function(index, element) {
        var TObj = {
            mm: null,
            ss: null,
            TimeInSec: null
        };
        TObj.mm = $("select[name='mm']", element).val();
        TObj.ss = $("select[name='ss']", element).val();
        TObj.TimeInSec = 60 * TObj.mm + TObj.ss;
        console.log("mm : " + JSON.stringify(TObj.mm) + ", ss : " + JSON.stringify(TObj.ss));
        TimestampObj[index] = TObj;
        var Missing = null;


        // Check for missing time-settings for stops/NumOfTimestamps >= 1:
        if (((NumOfTimestamps > index + 1) ||  (NumOfTimestamps == 1)) && ((TObj.mm === null) ||  (TObj.ss === null))) {
            if (TObj.mm === null) {
                Missing = 'minutterne';
                if (TObj.ss === null)
                    Missing += ' og sekunderne';
            } else
                Missing = 'sekunderne';
            alert("ADVARSEL:\n" + StartStr + ', men ' + Missing + ' i "Stop ' + (index + 1).toString() + '" er ikke sat!');
            Error = true;
        }

        // Check for invalid values - NumOfTimestamps/stops has to be like: "Stop 1" <= "Stop 2" <= "Stop 3"....
        if ((Missing === null) && (index > 0) && (NumOfTimestamps > index + 1) && (TimestampObj[index - 1].TimeInSec > TObj.TimeInSec)) {
            alert("ADVARSEL:\n" + StartStr + ', men tiden i "Stop ' + (index).toString() + '" er større end i "Stop ' + (index + 1).toString() +
                '", hvilket ikke er tilladt!' + "\n" + 'Tiderne i stops skal være fortløbende, således at "Stop 1" <= "Stop 2" <= "Stop 3"...');
            Error = true;
        }

    });
    console.log("TimestampObj : " + JSON.stringify(TimestampObj));

    return Error;
}


function CheckInputValues(NextParent) {
    var Error = false;
    var TSObj = {};
    var NumOfTimestamps = $(".class_TimeStampForm").length;
    $(".TimeStampForm").each(function(index1, element1) {
        var TObj = {
            mm: null,
            ss: null,
            EventForm_HasVal: false,
            QuestionField_HasVal: false
        };
        TObj.mm = $("select[name='mm']", element1).val();
        TObj.ss = $("select[name='ss']", element1).val();
        console.log("X1 - mm: " + TObj.mm + ", ss: " + TObj.ss);
        var NumOfEventForms = $(".EventForm", element1).length;
        $(".EventForm", element1).each(function(index2, element2) {
            var EventInfo = $("textarea[name='EventInfo']", element2).val();
            var EventFeedback = $("textarea[name='EventFeedback']", element2).val();

            // if ( (EventInfo !== "") || (EventFeedback !== "") )
            if (EventInfo !== "")
                TObj.EventForm_HasVal = true;

            // .
            if ((NumOfEventForms > index2 + 1) && !TObj.EventForm_HasVal) {
                alert("ADVARSEL:\n" + '"Spørgsmål ' + (index1 + 1).toString() + '" skal spørgsmål-tekst eller svarmuligheder');
                $(NextParent).remove(); // Dette fjerner det naeste element man forsoeger at tilfoeje.
                Error = true;
            }

            $(".QuestionField", element2).each(function(index3, element3) {

                console.log("X1 - Stop: " + (index1 + 1).toString() + ", Spørgsmål: " + (index2 + 1).toString() + ", QuestionField: " + (index3 + 1).toString());

                var Question = $("input[name='Question']", element3).val();
                var Rsvar = ($("input[name='Rsvar']", element3).prop('checked') ? true : false);
                var Csvar = ($("input[name='Csvar']", element3).prop('checked') ? true : false);


                console.log("X1 - EventInfo: " + EventInfo + ",Question: " + Question + ", Rsvar: " + Rsvar + ", Csvar: " + Csvar + ", EventFeedback: " + EventFeedback);

                // Check that some text is supplied along with a correct answer:
                if ((Question === "") && (Rsvar || Csvar)) {
                    alert("ADVARSEL:\n" + 'I "Stop ' + (index1 + 1).toString() + '", "Spørgsmål ' + (index2 + 1).toString() +
                        '", "Svarmulighed ' + (index3 + 1).toString() + '" er der angivet en korrekt svarmulighed uden tilhørende tekst!');
                    $(NextParent).remove(); // Dette fjerner det naeste element man forsoeger at tilfoeje.
                    Error = true;
                }

                if ((Question !== "") && (Rsvar ||  Csvar))
                    TObj.QuestionField_HasVal = true;

            });

            // // Checks that no new timestamps are added if no values are given in the input-fields current timestamp.
            // if ( (NumOfEventForms > index2 + 1) && !TObj.QuestionField_HasVal ) {
            //     alert("ADVARSEL:\n" + '"Spørgsmål '+(index1+1).toString()+'" XXXXX');
            //     $(NextParent).remove(); // Dette fjerner det naeste element man forsoeger at tilfoeje.
            //     Error = true;
            // }

        });

        TSObj[index1] = TObj;

        // Checks that no new timestamps are added if no values are given in the input-fields current timestamp.
        if ((NumOfTimestamps > index1 + 1) && (TSObj[index1].mm !== null) &&  (TSObj[index1].ss !== null) &&
            (!TSObj[index1].EventForm_HasVal)) {
            alert("ADVARSEL:\n" + 'I "Stop ' + (index1 + 1).toString() + '" er der ingen udfyldte spørgsmål eller svar muligheder!');
            $(NextParent).remove(); // Dette fjerner det naeste element man forsoeger at tilfoeje.
            Error = true;
        }
    });

    console.log("X1 - TSObj: " + JSON.stringify(TSObj));

    return Error;
}


function GenerateNumberSelect(MinNum, MaxNum, NameVal, UserVal, ClassSelector) {
    console.log("GENNUM");
    var HTML = '<select name="' + NameVal + '" class="' + ClassSelector + '">';
    HTML += (UserVal !== false) ? '<option selected disabled>' + UserVal + '</option>' : '';
    for (var i = MinNum; i <= MaxNum; i++) {
        HTML += '<option value="' + i + '">' + i + '</option>';
    }
    HTML += '</select>';

    return HTML;
}


// function SetDualSwitchState(this_obj) {
//     if ($('input[value=radiobutton]', this_obj).is(':checked')) {
//         $('.Csvar', this_obj).hide();
//         $('.Rsvar', this_obj).show();
//         $('.Csvar', this_obj).removeAttr('checked'); // This deletes the former choice...
//         console.log("Csvar hide");
//     }
//     if ($('input[value=checkbox]', this_obj).is(':checked')) {
//         $('.Csvar', this_obj).show();
//         $('.Rsvar', this_obj).hide();
//         $('.Rsvar', this_obj).removeAttr('checked'); // This deletes the former choice...
//         console.log("Rsvar hide");
//     }
//     console.log("radiobutton:" + $('input[value=radiobutton]', this_obj).is(':checked'));
//     console.log("checkbox:" + $('input[value=checkbox]', this_obj).is(':checked'));
// }


function RadioButtonDualSwitch(Selector_radiobutton) {
    $(document).on('click', Selector_radiobutton, function(event) {
        var Parent = $(this).parent();
        console.log(" ThisTagName " + $(this).get(0).tagName + ", Parent " + Parent.get(0).tagName);
        // SetDualSwitchState(Parent);
    });
}


function CheckEventFormPosition(this_obj) {
    var ClosestEventForm = $(this_obj).closest(".EventForm");
    var ClosestEventForm_class = ClosestEventForm.attr("class");
    console.log("ClosestEventForm_class : " + ClosestEventForm_class);
    console.log("this_obj name : " + this_obj.get(0).tagName);
    // if (typeof(ClosestEventForm_class) !== "undefined") { // If QuestionField or EventForm is added...
    //     // SetDualSwitchState(ClosestEventForm);
    // } else { // If TimeStampForm is added...
    //     $('.Csvar', this_obj).hide();
    //     $('.Rsvar', this_obj).show();
    // }
}

// Selector = ".EventForm .QuestionWrapperButton"
// function QuestionWrapperButtonControl(Selector) {
//     $(document).on('click', Selector, function(event) {
//         event.preventDefault();
//         var EventFormObj = $(this).parent();
//         $(".QuestionWrapper", EventFormObj).toggleClass("dhide");
//         $(".QuestionWrapper", EventFormObj).slideToggle();
//         if ($(".QuestionWrapper", EventFormObj).prop("class").indexOf("dhide") !== -1)
//             $(".QuestionWrapperButton", EventFormObj).html('<span class="glyphicon glyphicon-chevron-right"></span> Svar og feedback');
//         else
//             $(".QuestionWrapperButton", EventFormObj).html('<span class="glyphicon glyphicon-chevron-down"></span> Skjul svar og feedback');
//     });
// }


function QuestionWrapperButtonControl(Selector) {
    $(document).on('click', "input[name='valg']", function(event) {
        var ParentObj = $(this).closest(".EventForm");
        var RadioInformation = ($("input[value='RadioInformation']", ParentObj).prop('checked') ? true : false);
        var RadioQuestion = ($("input[value='RadioQuestion']", ParentObj).prop('checked') ? true : false);
        // var RadioButton = ((ParentObj).prop('checked')) ? true : false;
        console.log("QuestionWrapperButton - OK");
        if (RadioQuestion) {
            // $("input[name=EventHeader]", ParentObj).hide();

            $("textarea", ParentObj).val("");     // Delete all values in the EventInfo-field and FeedbackField 

            $(".EventInfo", ParentObj).slideUp("fast", function() {
                $(".EventQuestion", ParentObj).slideDown("fast", function() {
                    $(".QuestionWrapper", ParentObj).slideDown("fast");
                });
            });
            console.log("RadioInformation - OK");
        }
        if (RadioInformation) {

            $("textarea", ParentObj).val("");     // Delete all values in the EventQuestion-field and FeedbackField
            $("input[name=Question]", ParentObj).val(""); // Delete all text-values in the QuestionFields
            $("input[type=checkbox]", ParentObj).prop( "checked", false ); // Remove all checkbox selections
            $("input[type=checkbox]:eq(0)", ParentObj).prop( "checked", true ); // Add checkbox selection on the first checkbox

            $(".EventQuestion", ParentObj).slideUp("fast", function() {
                $(".QuestionWrapper", ParentObj).slideUp("fast", function() {
                    $(".EventInfo", ParentObj).slideDown("fast");
                });
            });
            
            console.log("RadioQuestion - OK");
        }
    });
}


function ReturnAjaxData(Type, Url, Async, DataType) {
    $.ajax({
        type: Type,
        url: Url,
        async: Async,
        dataType: DataType,
        success: function(Data) {
            console.log("ReturnAjaxData: " + JSON.stringify(Data));
            jsonData = JSON.parse(JSON.stringify(Data));
            // JsonExternalData = JSON.parse(JSON.stringify(Data));
            // console.log("HowWhyData: " + HowWhyData); 
        }
    }).fail(function() {
        alert("Ajax failed to fetch data - the requested data might not exist...");
    });
}

function ReturnURLPerameters(UlrVarObj){
    var UrlVarStr = window.location.search.substring(1);
    console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&");  // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray){
        var UrlVarSubPairArray = UrlVarPairArray[i].split("=");  // & = %3D
        if (UrlVarSubPairArray.length == 2){
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify( UlrVarObj ));
    return UlrVarObj;
}


//######################################################################################
//                              Regenerate form-state
//###################################################################################### 


// NOTE: IE < 9 understoetter ikke:   Object.keys(a).length;
//      http://stackoverflow.com/questions/5533192/how-to-get-object-length 
function ReturnObjKeyNames(Obj) {
    var count = 0;
    var KeyArray = [];
    for (var KeyName in Obj) {
        if (Obj.hasOwnProperty(KeyName)) {
            count++;
            KeyArray.push(KeyName);
        }
    }
    console.log("count: " + count + ", KeyArray: " + KeyArray);
    return KeyArray;
}

// MARK
function ReGenerateForm(Selector) {

        window.jsonData = null;

        var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
        UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
        console.log("ReGenerateForm - UlrVarObj: " + JSON.stringify(UlrVarObj) + ", UlrVarObj.file: " + UlrVarObj.file);

        if (UlrVarObj.file !== ""){ // Check if a filenumber has been refrenced through the URL
            ReturnAjaxData("GET", "json/VideoData"+String(UlrVarObj.file)+".json", false, "json");
            console.log("ReGenerateForm - Filelocation: json/VideoData"+String(UlrVarObj.file)+".json");
            console.log("ReGenerateForm - jsonData: " + JSON.stringify(jsonData));
        }

        if (jsonData !== null){ // If a valid file has been refrenced then...

            var json = jsonData;
            // json = JSON.parse(JSON.stringify(jsonData)); // Copy the the template-object "jsonData"

            // $(Selector).css("color", "#F00"); // SAET ROED TEKST, SAA MAN KAN SE AT FUNKTIONEN ER AKTIV!!!

            console.log("ReGenerateForm - json: " + JSON.stringify(json));

            // $("#video_url").val(json.URL);
            $("#video_url").val(json.EmbedURL);   //  NEW: NOV 2015
            $("#video_startFrameTitle").val(json.startFrameTitle);
            $("#video_startFrameText").val(json.startFrameText);
            $("#video_startButtonTitle").val(json.startButtonTitle);

            console.log("json.startFrameTitle: " + json.startFrameTitle + ", json.startButtonTitle: " + json.startButtonTitle + ", json.URL: " + json.URL);

            var QD = json.QuizData;
            console.log('QD: ' + QD);


            // Assume JS is array
            for (var key in QD) {

                if (typeof(QD[key].TimeStamp) !== "undefined") {
                    // if (key === 0) { // if Selector is empty - eg. not prior TimeStampForms...
                    if (key == 0) { // if Selector is empty - eg. not prior TimeStampForms...   //  NEW: NOV 2015
                        $(Selector).html(TimeStampForm);
                        console.log('#####  TRUE - key: ' + key);
                    } else { // if Selector already has one or more TimeStampForms...
                        $(Selector + " .TimeStampForm:last-child").after(TimeStampForm);
                        console.log('#####  FALSE - key: ' + key);
                    }
                    // Remove all QuestionFields from the newly made TimeStampForms:
                    $(".TimeStampForm:last-child .QuestionField").remove();



                    console.log('----- QD[key].TimeStamp.length: ' + QD[key].TimeStamp.length);
                    if (QD[key].TimeStamp.length > 0) {
                        for (var Tkey in QD[key].TimeStamp) {
                            var TObj = QD[key].TimeStamp[Tkey];
                            $(".TimeStampForm:last-child select[name='" + TObj.name + "']").val(TObj.value);
                            console.log("TObj.name: " + TObj.name + ", TObj.value: " + TObj.value);
                        } // END for
                    } // END if

                    if (typeof(QD[key].EventForm) !== "undefined") {

                        console.log('----- QD[key].EventForm.length: ' + QD[key].EventForm.length);

                        if (QD[key].EventForm.length > 0) {

                            for (var key1 in QD[key].EventForm) { // Each key1 is an EventForm
                                if (key1 > 0) {
                                    $(".TimeStampForm:last-child .EventForm:last-child").after(EventForm);

                                    // Remove all QuestionFields from the newly made TimeStampForms:
                                    $(".TimeStampForm:last-child .EventForm:last-child .QuestionField").remove();
                                }

                                var QFWrap = $(".TimeStampForm:last-child .EventForm:last-child .QuestionFieldWrapper");

                                var Wrap = $(".TimeStampForm:last-child .EventForm:last-child");

                                for (var key2 in QD[key].EventForm[key1]) { // Each key2 is an input-tag
                                    var Obj = QD[key].EventForm[key1][key2];

                                    if (Obj.name == "EventQuestion") {   //  NEW: NOV 2015
                                        $("textarea[name='EventQuestion']", Wrap).val(Obj.value);
                                    }

                                    if (Obj.name == "Question") {
                                        // Append a newly created QuestionField to the current EventForm for each time
                                        // an input-field "Question" is incountered. 
                                        $(QuestionField).appendTo(QFWrap);
                                        $("div:last-child input[name='Question']", QFWrap).val(Obj.value);
                                    }

                                    if (Obj.name == "EventHeader") {
                                        $("input[name='EventHeader']", Wrap).val(Obj.value);
                                        // console.log("==== TEXT: " + $("div input[name='EventHeader']", Wrap).parent().get(0).tagName );
                                    }

                                    if ((Obj.name == "EventInfo") && (Obj.value !== "")) {
                                        $("textarea[name='EventQuestion']", Wrap).hide();  
                                        $(".QuestionWrapper", Wrap).hide(); 
                                        $("textarea[name='EventInfo']", Wrap).show();
                                        $("textarea[name='EventInfo']", Wrap).val(Obj.value);
                                    }

                                    if (Obj.name == "EventFeedback") {
                                        $("textarea[name='EventFeedback']", Wrap).val(Obj.value);
                                    }

                                    if (Obj.name == "Rsvar") {
                                        $("div:last-child input[name='Rsvar']", QFWrap).prop('checked', true);
                                    }

                                    if (Obj.name == "Csvar") {
                                        $("div:last-child input[name='Csvar']", QFWrap).prop('checked', true);
                                    }

                                    if (Obj.name == "valg") { // The if-statement makes it run only once pr EventForm:
                                        $("input[name='valg'][value='" + Obj.value + "']", Wrap).prop('checked', true);
                                    }

                                    console.log("key1: " + key1 + ", key2: " + key2 +
                                        "\nObj: " + JSON.stringify(Obj));
                                } // END for

                                // SetDualSwitchState(Wrap); // Set all DualSwitchState to match the selected states.
                            } // END for
                        } // END if
                    } // END if EventForm
                } // END if TimeStamp
            } // END for

            Pager("#PagerContainer", "#FormsContainer > div", "Pager");  //  NEW: NOV 2015

        } // END if jsonData !== null

    } // END function


function ReturnYoutubeVidId(url) {
    var UrlParts = (url.indexOf("?v=") !== -1) ? url.split("?v=") : url.split("/");
    return UrlParts[UrlParts.length - 1];
}

console.log("ReturnYoutubeVidId embed : " + ReturnYoutubeVidId("https://www.youtube.com/embed/s7L2PVdrb_8"));
console.log("ReturnYoutubeVidId watch : " + ReturnYoutubeVidId("https://www.youtube.com/watch?v=s7L2PVdrb_8"));



function ReplicateVideoInputFormat(json) {


        console.log("ReplicateVideoInputFormat - json: " + JSON.stringify(json));


        // Video JSON-object-template-format by ATO:
        var vidJson = [{
            "video": null
        }, {
            "intro_header": null
        }, {
            "intro_text": null
        }, {
            "intro_knap": null
        }, {
            "stops": []
        }];
        var Tstop = {
            "timestamp": null,
            "events": []
        };
        var Tevent = {
            "eventtype": null,
            "tekst": "",
            "svar": [],
            "korrekt": [],
            "feedback": ""
        };


        var startFrameTitle = json.startFrameTitle;
        var startFrameText = json.startFrameText;
        var startButtonTitle = json.startButtonTitle;

        vidJson[0].video = ReturnYoutubeVidId(json.EmbedURL);
        vidJson[1].intro_header = htmlEntities(json.startFrameTitle);
        vidJson[2].intro_text = htmlEntities(json.startFrameText);
        vidJson[3].intro_knap = htmlEntities(json.startButtonTitle);


        console.log("vidJson 1 : " + JSON.stringify(vidJson));

        console.log("startFrameTitle: " + startFrameTitle + ", startButtonTitle: " + startButtonTitle + ", URL: " + URL);

        var QD = json.QuizData;


        for (var key in QD) { // For each timestamp...

            var Stop = JSON.parse(JSON.stringify(Tstop)); // Copy the the template-object "Tstop"

            var tt = 0;
            var mm = 0;
            var ss = 0;

            if (typeof(QD[key].TimeStamp) !== "undefined") {

                console.log('----- QD[key].TimeStamp.length: ' + QD[key].TimeStamp.length);
                if (QD[key].TimeStamp.length > 0) {
                    for (var Tkey in QD[key].TimeStamp) {
                        var TObj = QD[key].TimeStamp[Tkey];
                        // if (TObj.name == "tt") tt = parseInt(TObj.value);  // NOT IN USE!!!
                        if (TObj.name == "mm") mm = parseInt(TObj.value);
                        if (TObj.name == "ss") ss = parseInt(TObj.value);
                        console.log("ReplicateVideoInputFormat - TObj.name: " + TObj.name + ", TObj.value: " + TObj.value + ", typeof(TObj.value): " + typeof(TObj.value));
                        console.log("ReplicateVideoInputFormat - tt: " + tt + ", mm: " + mm + ", ss: " + ss);
                    } // END for
                } // END if

                // var TimeInSec = tt*3600 + mm*60 + ss;
                var TimeInSec = mm * 60 + ss;

                Stop.timestamp = TimeInSec;

                console.log("TimeInSec: " + TimeInSec + ", Stop: " + JSON.stringify(Stop));

                if (typeof(QD[key].EventForm) !== "undefined") {

                    console.log('----- QD[key].EventForm.length: ' + QD[key].EventForm.length);

                    if (QD[key].EventForm.length > 0) {

                        for (var key1 in QD[key].EventForm) { // Each key1 is an EventForm

                            var Event = JSON.parse(JSON.stringify(Tevent)); // Copy the the template-object "Tevent"

                            var AnswerNum = -1;

                            for (var key2 in QD[key].EventForm[key1]) { // Each key2 is an input-tag
                                var Obj = QD[key].EventForm[key1][key2];

                                if (Obj.name == "valg") {
                                    if (Obj.value == "RadioInformation") Event.eventtype = "info";
                                    // if (Obj.value == "RadioQuestion"){    
                                    //     Event.eventtype = "svarknap";
                                    //     Event.eventtype = "checkbox";
                                    // }
                                }

                                // if ((Obj.name == "Question") && (Obj.value !== "")) {
                                if (Obj.name == "Question") {
                                    Event.svar.push(htmlEntities(Obj.value));
                                    ++AnswerNum;
                                }

                                // if (Obj.name == "EventHeader") {

                                // } 

                                if ((Obj.name == "EventInfo") && (Obj.value !== "")) {
                                    Event.tekst = htmlEntities(Obj.value);
                                    Event.eventtype = "info";
                                    console.log("EventInfo - Obj.value: " + Obj.value + ", htmlEntities: " + Event.tekst);
                                }

                                if ((Obj.name == "EventQuestion") && (Obj.value !== "")) {
                                    Event.tekst = htmlEntities(Obj.value);
                                    Event.eventtype = "svarknap";
                                    console.log("EventQuestion - Obj.value: " + Obj.value + ", htmlEntities: " + Event.tekst);
                                }

                                if ((Obj.name == "EventFeedback") && (Obj.value !== "")) {
                                    Event.feedback = htmlEntities(Obj.value);
                                }

                                // if (Obj.name == "Rsvar") {
                                //     Event.korrekt.push( AnswerNum.toString() );
                                // }

                                if (Obj.name == "Csvar") {
                                    Event.korrekt.push(AnswerNum.toString());
                                    // if (Event.korrekt.length == 1) Event.eventtype = "svarknap";
                                    if (Event.korrekt.length > 1) Event.eventtype = "checkbox";
                                }

                                console.log("key1: " + key1 + ", key2: " + key2 +
                                    "\nEvent: " + JSON.stringify(Event));

                            } // END for


                            console.log("X2 -- Event: " + JSON.stringify(Event));

                            // // If no answer options and no feedback is given, then: eventtype = "info":
                            // if ((Event.korrekt.length === 0) && (Event.korrekt.length === 0) && (Event.feedback === null)) {
                            //     Event.eventtype = "info";
                            // }



                            Stop.events.push(Event);

                        } // END for
                    } // END if
                } // END if EventForm
            } // END if TimeStamp

            vidJson[4].stops.push(Stop);

        } // END for

        console.log("vidJson 1 : " + JSON.stringify(vidJson));

        return vidJson;

    } // END function


// ================================
//      Pager
// ================================


var Range = 9;
var ActiveLinkNum = 1;

function Pager(PagerSelector, TargetSelectorChild, CssId) {

    var NumOfPages = 0;
    $(TargetSelectorChild).each(function(index, element) {
        ++NumOfPages;
    });
    console.log("NumOfPages : " + NumOfPages);


    var HTML = '<ul id="' + CssId + '" class="PagerClass">';

    if (NumOfPages == 1) {
        HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
    }

    if ((1 < NumOfPages) && (NumOfPages <= Range + 1)) {
        for (var i = 1; i <= NumOfPages; i++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + i + '</a></li>';
        }
    }

    if (NumOfPages > Range + 1) {
        var StartIndex = ActiveLinkNum - Math.round((Range - 1) / 2); // Find the startindex based on ActiveLinkNum
        if (StartIndex < 1) StartIndex = 1; // Ajust startindex for low ActiveLinkNum
        if (Range + StartIndex > NumOfPages) StartIndex = NumOfPages - Range; // Ajust startindex for high ActiveLinkNum

        // StartIndex = Math.round((NumOfPages - Range)/2);
        console.log("StartIndex : " + StartIndex);


        if (StartIndex == 2) { // Ugly special case...
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li>';
        }
        if (StartIndex > 2)
            HTML += '<li><a href="#" class="PagerButton btn btn-default"> 1 </a></li><li> ... </li>';
        for (var j = StartIndex; j < Range + StartIndex; j++) {
            HTML += '<li><a href="#" class="PagerButton btn btn-default">' + j + '</a></li>';
        }
        if (Range + StartIndex == NumOfPages)
            for (var k = Range + StartIndex; k <= NumOfPages; k++) {
                HTML += '<li><a href="#" class="PagerButton btn btn-default">' + k + '</a></li>';
            } else
                HTML += '<li> ... </li><li><a href="#" class="PagerButton btn btn-default">' + NumOfPages + '</a></li>';

    }
    HTML += '</ul>';

    // Generate the pager:
    $(PagerSelector).html(HTML);

    $(TargetSelectorChild).removeClass("dshow");
    $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild

    // 
    $("#" + CssId + " .PagerButton").click(function(e) {
        e.preventDefault(); // Prevent the link-nature of the anchor-tag.
        $("#" + CssId + " .PagerButton").removeClass("btn-default btn-primary");
        $("#" + CssId + " .PagerButton").addClass("btn-default");
        $(this).toggleClass("btn-default btn-primary");

        ActiveLinkNum = $(this).text();
        console.log("ActiveLinkNum 2: " + ActiveLinkNum);

        // TargetSelectorChildText = $(TargetSelectorChild).text();
        // console.log("TargetSelectorChildText: " + TargetSelectorChildText);


        Pager(PagerSelector, TargetSelectorChild, CssId); // Update the pager by recursive call
    });

    var LastElement = null;

    // Set the chosen color if the pager-button is showen:
    $(PagerSelector + " li a").each(function(index, element) {
        if ($(element).text() == ActiveLinkNum) {
            $(element).toggleClass("btn-default btn-primary");
        }
        LastElement = element;
    });

    // If the last STOP (n) is selected, and the user deletes the current STOP (n), then the user needs to "routed" to the second-last STOP (n-1):
    if ( ActiveLinkNum > NumOfPages){
        ActiveLinkNum = NumOfPages;
        $(LastElement).toggleClass("btn-default btn-primary");
        $(TargetSelectorChild + ":eq(" + (parseInt(ActiveLinkNum) - 1) + ")").addClass("dshow"); // TargetSelectorChild
    }

    console.log("ActiveLinkNum 1: " + ActiveLinkNum + ", NumOfPages: " + NumOfPages);
}



//######################################################################################
//                              RUN CODE....
//###################################################################################### 


$(document).ready(function() {

    

            // ================================
            //      Video loader
            // ================================

            var VideoObj = Object.create(VideoClass);



            VideoObj.DeleteSelections(); // Delete previous selections on reload.

            // HENT DEFAULT VIDEO IND FRA STARTEN
            VideoObj.LoadDefaultVideo();
            VideoObj.LoadVideo();

            // Hent data ind fra inputfelterne:
            var JsonVideoInput = ReplicateVideoInputFormat(VideoObj);
            JsonVideoInput_update = JsonVideoInput;

            // Load data over i quiz'en:
            loadGenericData(); 

            /*setupplayer();*/
            // $("#delete_selections").click(function() {
            //     VideoObj.DeleteSelections();
            //     console.log("VideoObj submit : " + JSON.stringify(VideoObj));
            // });

            $("#load_default_video").click(function(e) {
                e.preventDefault(); // Prevent the link-nature of the anchor-tag.
                VideoObj.LoadDefaultVideo();

                console.log("VideoObj.EmbedURL 1: " + VideoObj.EmbedURL + ", VideoObj.WatchURL 1: " + VideoObj.WatchURL);
            });

            $("#load_video").click(function() {
                VideoObj.LoadVideo();
                console.log("VideoObj submit : " + JSON.stringify(VideoObj));
                // VideoObj.DisplayJsonML();

                console.log("VideoObj.EmbedURL 2: " + VideoObj.EmbedURL + ", VideoObj.WatchURL 2: " + VideoObj.WatchURL);
            });


            // ================================
            //      User Inferface
            // ================================

            InitHTML('#FormsContainer', TimeStampForm);

            // AddElement('.addfield', '.QuestionField', QuestionField, 4);
            AddLastElement('.addfield', '.QuestionField', '.EventForm', QuestionField, 4);
            RemoveElement('.removefield', '.QuestionField', 2);

            AddElement('.addform', '.EventForm', EventForm, false);
            RemoveElement('.removeform', '.EventForm', 1);

            // OLD:
            // AddElement('.add_TimeStampForm', '.TimeStampForm', TimeStampForm, false);
            // RemoveElement('.remove_TimeStampForm', '.TimeStampForm', 1);

            // NEW:
            AddTimestampLast('.AddNewPageButton', '.TimeStampForm', '#FormsContainer', TimeStampForm, false, "#PagerContainer", "#FormsContainer > div", "Pager");
            RemoveTimestamp('.remove_TimeStampForm', '.TimeStampForm', 1, "#PagerContainer", "#FormsContainer > div", "Pager");

            Pager("#PagerContainer", "#FormsContainer > div", "Pager");


            // RadioButtonDualSwitch(".EventForm input[name='valg']");

            // QuestionWrapperButtonControl(".EventForm .QuestionWrapperButton");
            QuestionWrapperButtonControl();

            MarkFistAnswerAsCorrectIfNoneSelected(false); // Mark the first answer as cheked!


            $(".WatchQuiz").click(function(e) {
                e.preventDefault(); // Prevent the link-nature of the anchor-tag.

                MarkFistAnswerAsCorrectIfNoneSelected(true); // Check if a "Sæt" is missing an answer!

                console.log("ScrollUp: " + $(this).prop("class"));

                // Naar der trykkes paa den nederste ".WatchQuiz", saa scrolles der til "#ScrollHere":
                if ($(this).prop("class").indexOf("ScrollUp") !== -1) {
                    $('html, body').animate({
                        scrollTop: $("#ScrollHere").offset().top + 'px'
                    }, 'fast');
                }

                // if (CheckTimeStopValues('Du vælger nu "Se Quiz"') == true){
                //     return 0;
                // }

                // CheckInputValues(false);

                // VideoObj.LoadDefaultVideo(); // Elers vrker det ikke med ReGenerateForm.   
                VideoObj.LoadVideo(); // Elers vrker det ikke med ReGenerateForm.
                VideoObj.LoadDefaultNoVideoImgIfNoVideoIsChosen();
                VideoObj.QuizData = GetFormsData('#FormsContainer');


                var JsonVideoInput = ReplicateVideoInputFormat(VideoObj); 
                $(".JsonVideoInput").val(JSON.stringify(JsonVideoInput, null, 4));
                console.log("JsonVideoInput: " + JSON.stringify( JsonVideoInput ) );


                // // Dette ukommenteres indtil moedet kvalitetscirklen mandag d. 9/3-2015 er overstaaet: 
                // $("#JsonOutput").html(JSON.stringify(VideoObj, null, 4));
                // $("#JsonVideoInputTest").html(JSON.stringify(JsonVideoInput, null, 4));


                JsonVideoInput_update = JsonVideoInput;


                ////
                //Her refreshes videoquiz preview iframen: 

                $(".player_container").html("<div id='player' class='embed-responsive-item'></div><div id='time'></div><div id='time_bar'></div>");

                loadGenericData(); 
                setupplayer();
                //

            });


            // $(".embedtext").click(function () {
            //    $(this).select();
            // });

            // TEST TIL VISNINGSSITET:
            // <script type="text/javascript">
            //     $(document).ready(function() {
            //         $("h3").click(function () { 
            //             alert("SELECT");
            //             $(this).select(); 
            //         });
            //     });
            // </script>


            // TEST TIL GENERISKVIDEOQUIZ:
            // <script type="text/javascript">
            //     $(document).ready(function() {
            //         $("textarea").click(function () { 
            //             alert("SELECT");
            //             $(this).select(); 
            //         });
            //     });
            // </script>


            $(".JsonVideoInput").click(function () {
                $(this).select();
            });

            

            // ================================
            //      Regenerate user interface
            // ================================

            // VIGTIGT: Version 15 virker med det gamle data format, hvor video-info IKKE er med!
            ReGenerateForm("#FormsContainer");


}); // END $(document).ready()
