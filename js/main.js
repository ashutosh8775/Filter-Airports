'use strict';

if (data && typeof data == 'object') {
        const $iLimit= 4;
        var $sortedData = [];
        var $searchedData = [];
        var $paginate = true;

        const getAirportData = function(obj){
            let html = '';
            let $offsetVal = obj && obj.offset ? obj.offset : 0;
            let $totalDataLength = Object.keys(obj.data).length;
            let $lastItem = $offsetVal + ($totalDataLength < $iLimit ? $totalDataLength : $iLimit);
            
            for (const [i,v] of Object.entries(obj.data.slice($offsetVal, $lastItem))) {
                html +=`<tr>
                            <th scope="row">${v.name || '-'}</th>
                            <td>${v.icao || '-'}</td>
                            <td>${v.iata || '-'}</td>
                            <td>${v.elevation || '-'}</td>
                            <td>${v.latitude || '-'}</td>
                            <td>${v.longitude || '-'}</td>
                            <td>${v.type || '-'}</td>
                        </tr>`; 
            }
            
            document.getElementById('search_results_cont').innerHTML = html;
            document.getElementById('current_results').textContent = ($offsetVal + 1) + '-' + $lastItem;
            document.getElementById('total_results').textContent = $totalDataLength;

            if($paginate){
                paginate({'total':$totalDataLength});
            }
        };

        // on loadd
        getAirportData({'data':data});
    
        function paginate(obj){
            if(obj.total <= $iLimit ){
                $('.navigate_arrows').addClass('invisible');
                return;
            } else {
                $('.navigate_arrows').removeClass('invisible');
            }
            $('.navigate_arrows').pagination({
                items: obj.total,
                itemsOnPage: $iLimit,
                cssStyle: 'light-theme',
                nextText:'<i class="fa fa-arrow-right"></i>',
                prevText:'<i class="fa fa-arrow-left"></i>',
                onPageClick: function(page, event) {
                    $paginate = false;
                    let $iPage = (page < 2 ? 1 : page);
                    let $iOffset = (($iPage - 1) * $iLimit);
                    let $paginateData;
                    if($searchedData && $searchedData.length > 0 ){
                        $paginateData = $searchedData;
                    } else if($sortedData && $sortedData.length > 0){
                        $paginateData = $sortedData;
                    } else {
                        $paginateData = data;
                    }
                   
                    getAirportData({'data':$paginateData,'offset':$iOffset});
                }
            });
            
        }

        const $checkboxSelector = document.querySelectorAll('.filters input[name="type"]');

        const sortDataBasedOnType = function(obj){
            $paginate = true;
            $sortedData = [];

            let $selectedTypes = [];
            for (var i=0; i<$checkboxSelector.length; i++) {
                if ($checkboxSelector[i].checked) {
                    $selectedTypes.push($checkboxSelector[i].value);
                }
            }   
            
            if ($selectedTypes.length < 1){
                getAirportData({'data':data});
                return;
            }

            for (const [i,v] of Object.entries(data)) {
                if($selectedTypes.indexOf(v.type) == -1){ 
                    continue;
                } else {
                    $sortedData.push({'id':v.id,'name':v.name,'icao':v.icao,'iata':v.iata,'elevation':v.elevation,'latitude':v.latitude,'longitude':v.longitude,'type':v.type })
                }
            }
            
            getAirportData({'data':$sortedData,'type':$selectedTypes});
        }

        
        //on selecting type filters
        for (var i in $checkboxSelector) {
            if($checkboxSelector[i].value){
                $checkboxSelector[i].onclick = function() {
                    sortDataBasedOnType();
                };
            }
        }
        
        const $searchInputSelector = document.querySelector('input[name="search"]');
        $searchInputSelector.addEventListener("keyup", function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {

            } else {
                $paginate = true;
                $searchedData = [];
                
                let value = $(this).val().toLowerCase();
                var regex = new RegExp(value, "i");
                let $searchData = $sortedData && $sortedData.length > 0 ?  $sortedData : data; 

                for (const [i,v] of Object.entries($searchData)) {
                    if((v.name.search(regex) != -1) || (v.icao && v.icao.search(regex) != -1) || (v.iata && v.iata.search(regex) != -1) || (v.elevation && v.elevation.toString().search(regex) != -1) || (v.latitude && v.latitude.toString().search(regex) != -1) || (v.longitude && v.longitude.toString().search(regex) != -1) || (v.type && v.type.search(regex) != -1)){ 
                        $searchedData.push({'id':v.id,'name':v.name,'icao':v.icao,'iata':v.iata,'elevation':v.elevation,'latitude':v.latitude,'longitude':v.longitude,'type':v.type })
                    }
                }
                // console.log('searchedData==',$searchedData);
                getAirportData({'data':$searchedData});
            }
        }); 
}
