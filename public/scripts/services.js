var services = {
    trade : function(symbol){
        $.ajax({
            type: "POST",
            url: '/balance',
            data: {name :symbol},
        }).done(function(response){
            console.log("BALANCE RESPONSE "+symbol);
            console.log(response.symbol);
            $("#tradeText").html("Trading now "+ symbol);
            $("#tradingBox").show();
        });
    }
};

$(document).ready(function () {


//intialize in the starting, clicking should resort it as well
// could be timed out automatically to update lists
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
                        services.trade(response[0].symbol);   //main trading UI builder
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