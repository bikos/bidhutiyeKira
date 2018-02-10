var services = {
    app : {
        balances : [],
        lowPercentage : null,
        highPercentage : null,
        hour : null,
        tradePair : null,
    },
    balance : function(symbol){
        var dfd  = jQuery.Deferred();
        $.ajax({
            type: "POST",
            url: '/balance',
            data: {name :symbol},
        }).done(function(response){
        if(symbol != undefined){
                $("#tradeText").html("Trading now "+ symbol);
                console.log(response);
                if(response=="NOT FOUND"){
                    $("#listOfBalances").empty();
                    $("#balances p").remove();
                    $("#error").show();
                    $("#error").html("Sorry "+symbol+" trading not avaliable yet");
                    $("#balances").hide();
                }
                else{
                    $("#error").hide();
                    $("#balances").empty();
                    $("#balances").show();
                    $("#balances").html("<p>Your available balance is "+response.available+"</p>");
                }
            }else{
                $("#listOfBalances").empty();
                $("#balances p").remove();
                $("#tradeText").empty();
                $("#error").hide();
                console.log(response);
                services.app.balances = response;
                $("#tradeText").append("Your Available Balances");
                var stringList = "";
                var listOfKeys = Object.keys(response);
                for(var i = 0; i < listOfKeys.length; i++){
                var tempName =  listOfKeys[i];
                if(response[tempName].available>0){
                    stringList+="<div class=\"cList\"><span style=\"margin-right:50px;\"><b>"+listOfKeys[i]+"</b></span> "+parseFloat(response[tempName].available).toFixed(3)+"</div>";
                }   
                }
                if(stringList.length==0){
                    stringList+="<div class=\"cList\">Bro you broke?</div>";
                }
                $("#balances").append("<div id=\"listOfBalances\"></div>");
                $("#listOfBalances").append(stringList);
            }
            $("#tradingBox").show();
            $("#balances").show();
            dfd.resolve( "hurray" );
            return dfd.promise();
        });
    },
    activeOrder :function(){
        $.ajax({
            type: "POST",
            url: '/activeOrder',
        }).done(function(response){
            $("#balances p").remove();
            $("#tradeText").empty();
            $("#listOfBalances").empty();
            $("#error").hide();
            console.log(response);
            $("#tradeText").append("Your Active Trades");
            var stringList = "";
            var listOfKeys = Object.keys(response);
            for(var i = 0; i < listOfKeys.length; i++){
            var tempName =  listOfKeys[i];
            {
                stringList+="<div class=\"cList\"><span style=\"margin-right:50px;\"><b>"+listOfKeys[i]+"</b></span> "+parseFloat(response[tempName].available).toFixed(3)+"</div>";
            }   
            }
            if(stringList.length==0){
                stringList+="<div class=\"cList\">Bro do you even trade?</div>";
            }
            $("#balances").append("<div id=\"listOfBalances\"></div>");
            $("#listOfBalances").append(stringList);
            $("#tradingBox").show();
            $("#balances").show();
        });

    },

    depositHistory : function(){
        $.ajax({
            type: "POST",
            url: '/depositHistory',
        }).done(function(response){
            $("#balances p").remove();
            $("#tradeText").empty();
            $("#listOfBalances").empty();
            $("#error").hide();
            $("#tradeText").append("Your Deposit History");
            var stringList = "";
            //
            console.log(response);
            for(var i = 0; i < response.depositList.length; i++){
           {
               var localDate = new Date(response.depositList[i].insertTime);
               var dateString = localDate.getDate() +"/"+ (localDate.getMonth()+1)+"/"+localDate.getFullYear();
                stringList+="<div class=\"cList\">Deposited <b>"+response.depositList[i].amount+" "+response.depositList[i].asset+"</b> From "+response.depositList[i].address+" on "+dateString+"</div>";
            }   
            }
            if(stringList.length==0){
                stringList+="<div class=\"cList\">Opps!! Nothing was deposited yo!.</div>";
            }

            //
            $("#balances").append("<div id=\"listOfBalances\"></div>");
            $("#listOfBalances").append(stringList);
            $("#tradingBox").show();
            $("#balances").show();
        });
    },
};


 // JQUERY EVENTS 
$(document).ready(function () {

//intialize in the starting, clicking should resort it as well
// could be timed out automatically to update lists
services.balance();

$.get('/menu', function(data){
    var option =  "";
    for (var i = 0; i < data.globalMenu.length; i++) {
        option += '<option value="' + data.globalCoins[i] + '">' + data.globalMenu[i] + '</option>';
    }
    $('#myselect').append(option);
    $('#myselect').select2();
});

// EVENT BASED OPERATIONS
$(document).on("click", "#calcButton", function () {
$.get('/nothing', function (data) {});
});

$(document).on("click", "#fullBalance", function(){
services.balance();    //pass nothing as param, returns full list, operate on this return type to find full balance
});

$(document).on("click", "#activeOrder", function(){
services.activeOrder();    
});

$(document).on("click", "#depositHistory", function(){
services.depositHistory();    
});

$(document).on("click", "#goMad", function(){
    $( "#dailog-goMad" ).dialog({
        title: "GOING INSANE",
        maxWidth:700,
        maxHeight: 600,
        width: 700,
        height: 600,
        modal: true,
    });

});

$(document).on("click", "#btc", function(){
    $("#weapon").html("BTC "+services.app.balances.BTC.available);
    services.app.tradePair= "BTC";
});

$(document).on("click", "#eth", function(){
    $("#weapon").html("ETH "+services.app.balances.ETH.available);
    services.app.tradePair = "ETH";

});

$(document).on("change", "#severity", function () {
    val = $(this).val();
    $("#greedVal").html(val+"%");
    services.app.highPercentage = val;
});

$(document).on("change", "#lowPercentage", function(){
    val = $(this).val();
    services.app.lowPercentage = val;
    $("#lowSelect").html(val);
});

$(document).on("click", ".timeButton", function(){
    val = parseInt($(this).attr("value"));
    services.app.hour = val;
    var stringTime = "Hour(s)";
    if(val==7){
        stringTime ="Days";
    }
    $("#timeRange").html(val+" "+stringTime);
});

jQuery('#myselect').on('change', (function () {
    //var value = $(this).val();
    $('#popupTable').hide();
    var value = $('#myselect').val();
    if(value.length>0){
        var urlString = "https://api.coinmarketcap.com/v1/ticker/" + value + "/";
    $.ajax({
        type: "GET",
        url: urlString
    }).done(function (response) {
        console.log(response);
        //put name on dailog box
        var titleT =response[0].name + " Info Detail";
        $("#priceUSD").html("Price in USD "+response[0].price_usd);
        $("#priceBTC").html("Price in BTC "+response[0].price_btc);
        $("#1hr").html("1 Hour change "+ response[0].percent_change_1h+ " %");
        $("#24hr").html("24 Hours change "+ response[0].percent_change_7d+ " %");
        $("#7day").html("7 days change " +response[0].percent_change_24h+ " %");
        $("#updated").html("changed "+moment(new Date(response[0].last_updated * 1000)).fromNow());
        $( "#dialog-message" ).dialog({
            title: titleT,
            maxWidth:600,
            maxHeight: 500,
            width: 600,
            height: 500,
            modal: true,
            buttons: {
            Trade: {
                    click: function () {
                        $(this).dialog("close");
                        services.balance(response[0].symbol);   //main trading UI builder
                    },
                    text: 'Trade',
                    class: 'trade-class'
                },
            Cancel: {
                    click: function () {
                        $(this).dialog("close");
                    },
                    text: 'Cancel',
                    class: 'cancel-class'
                },
            },
            show: {
                effect: "blind",
                duration: 1000
              },
              hide: {
                effect: "explode",
                duration: 1000
              }
          });
    }).fail(function (response) {
		alert("FAILURE: " + response);
	});
    }
}));




});