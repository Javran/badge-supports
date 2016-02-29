(function() {
    "use strict";

    $( document ).ready( function() {

        $(".factory").hide();
        K2Badge.init();


        var masterData = JSON.parse($.ajax({
            url: "master.json",
            async: false
        }).responseText);
        masterData = masterData.api_data;

        var masterShips = {};

        $.each( masterData.api_mst_ship, function(i,x) {
            masterShips[x.api_id] = x;
        });
        

        var badgeDb = JSON.parse($.ajax({
            url: "db.json",
            async: false
        }).responseText);

        var origins = JSON.parse($.ajax({
            url: "origins.json",
            async: false
        }).responseText);

        var mstId2FleetIdTable = K2Badge.mstId2FleetIdTable;
        function logText(msg) {
            $("<p>" + msg + "</p>").appendTo(".shiplist");
        }
        function genTag(shipId) {
            var mst = masterShips[shipId];
            return mst.api_name + "(" +
                mst.api_id + ")";
        }

        function checkFleetIds() {
            $(".shiplist").empty();
            var shipInfoTemp = $(".factory .ship_info");
            var shipInfoRowTemp = $(".factory .ship_info_row");
            var i,row;
            var curRow = shipInfoRowTemp.clone();
            var shipInfo;
            var fleetId,bInfo,iconSrc;
            var ship;

            for (i=0; i<masterData.api_mst_ship.length; ++i) {
                ship = masterData.api_mst_ship[i];
                if (ship.api_id >= 500)
                    continue;
                shipInfo = shipInfoTemp.clone();
                fleetId = mstId2FleetIdTable[ship.api_id];
                bInfo = badgeDb[fleetId];
                iconSrc =  "http://threebards.com/kaini/icons/" + 
                    (bInfo? bInfo.type : "UNKNOWN") + "/" + fleetId + ".png";
                $(".ship_tag", shipInfo).text(JSON.stringify( {
                    id: ship.api_id,
                    name: ship.api_name
                    // converted: fleetId,
                    // icon: iconSrc
                }));

                $(".ship_tag", shipInfo).text(genTag(ship.api_id));

                $("img", shipInfo).attr("src", iconSrc);

                // determine row number..
                if (curRow.children().length > 18) {
                    curRow.appendTo( ".shiplist" );
                    curRow = shipInfoRowTemp.clone();
                }
                shipInfo.appendTo( curRow );
            }

            if (curRow.children().length !== 0) {
                curRow.appendTo( ".shiplist" );
            }
        }

        function checkKainiIds() {
            $(".shiplist").empty();

            $.each(K2Badge.mstId2KainiTable, function(k,v) {
                var ship = masterShips[k];
                logText(genTag(ship.api_id) + " -> " + v);
                console.log(v);
            });
        }

        function checkColleIds() {
            $(".shiplist").empty();

            var uniqueBids = [];
            $.each(badgeDb, function(k,v) {
                if (v.unique) {
                    uniqueBids.push( k );
                }
            });

            var uniqueOrigins = [];
            $.each(origins, function(k,v) {
                if (uniqueOrigins.indexOf(v) === -1) {
                    uniqueOrigins.push(v);
                }
            });
            

            logText( "following 2 numbers should match" );
            logText( "unique id count = " + uniqueBids.length );
            logText( "unique origin count = " + uniqueOrigins.length );



            $.each( masterData.api_mst_ship, function(i,x) {
                if (x.api_id >= 500)
                    return;
              
                var originId = origins[x.api_id];


                var colleId = K2Badge.mstId2ColleTable[originId];

                if (typeof(originId) !== 'undefined') {
                    logText(genTag(x.api_id) + " <~~ " + 
                      genTag(originId) + " id=" + colleId);

                } else {
                    logText( "ERROR: " + genTag(x.api_id));
                }
            
            });


            
        }

        $("#fleet").on("click", checkFleetIds);
        $("#k2").on("click", checkKainiIds);
        $("#colle").on("click", checkColleIds);

    });
})();
