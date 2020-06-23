$(function() {
    var lnd = $('#select').val();
    console.log(lnd);
    switch (lnd) {
        case 'CR':
            getScript('/js/Graficas/CoilR.js', function() {
                retrieveData(function(results) {
                    $('#mean').text(results.mean.toFixed(4));
                });
            });
            break;
        default:
    }

    if ($(window).width() < 768) {
        $('.grafica').css("visibility", "visible");
        $('.grafica').hide();
        $('.grafica1').show();
        $("#select").change(function() {
            $('.grafica').hide();
            $('#' + $(this).val()).show();
            var lnd = $('#select').val();
            console.log(lnd);
            switch (lnd) {
                case 'CR':
                    getScript('/js/Graficas/CoilR.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                case 'OV':
                    getScript('/js/Graficas/OpV.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                case 'RV':
                    getScript('/js/Graficas/ReV.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                case 'OT':
                    getScript('/js/Graficas/OpT.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                case 'RT':
                    getScript('/js/Graficas/RelT.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                case 'SCR':
                    getScript('/js/Graficas/SCRe.js', function() {
                        retrieveData(function(results) {
                            $('#mean').text(results.mean.toFixed(4));
                        });
                    });
                    break;
                default:
            }
        });
    } else {
        $('.grafica').show();
        $('.grafica').css("visibility", "visible");
    }


    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('select option:contains("Coil Resistance")').prop('selected', true);
            $('.grafica').css("visibility", "visible");
            $('.grafica').hide();
            $('.grafica1').show();
            $("#select").change(function() {
                $('.grafica').hide();
                $('#' + $(this).val()).show();
                var lnd = $('#select').val();
                console.log(lnd);
                switch (lnd) {
                    case 'CR':
                        getScript('/js/Graficas/CoilR.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    case 'OV':
                        getScript('/js/Graficas/OpV.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    case 'RV':
                        getScript('/js/Graficas/ReV.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    case 'OT':
                        getScript('/js/Graficas/OpT.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    case 'RT':
                        getScript('/js/Graficas/RelT.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    case 'SCR':
                        getScript('/js/Graficas/SCRe.js', function() {
                            retrieveData(function(results) {
                                $('#mean').text(results.mean.toFixed(4));
                            });
                        });
                        break;
                    default:
                }
            });
        } else {
            $('.grafica').css("visibility", "visible");
            $('.grafica').show();
        }
    });
});