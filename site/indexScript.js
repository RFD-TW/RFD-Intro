let enterTime = moment(), enterMacchiatoTime = moment();
let totalSec, macchiatoSec;

let ripples = [];

$(document).ready(()=>
{
	// 傳送門 icon
	$(".ShownIcon").hover(
		function() { $(this).addClass("fa-shake"); },
		function() { $(this).removeClass("fa-shake"); }
	);
	
	// 主要區塊
	$("#IntroDiv").hover(
		function()
		{
			$(this).removeClass("border border-3 border-secondary");
			$(this).addClass('DivHover');
		},
		function()
		{
			$(this).removeClass('DivHover');
			$(this).addClass("border border-3 border-secondary");
		}
	);
	$("#ArticleDiv").hover(
		function()
		{
			$(this).removeClass("border border-3 border-light");
			$(this).addClass('DivHover');
		},
		function()
		{
			$(this).removeClass('DivHover');
			$(this).addClass("border border-3 border-light");
		}
	);
	
	// 焦糖瑪奇朵 Nav v-pill & tab
	$('#AdditionalTab').click(
		function()
		{
			enterMacchiatoTime = moment();
		}
	);
	$('#MacchiatoImage').click(
		function()
		{
			if (ripples.length == 0)
			{
				ripple = $('#IntroDiv').ripple(
					$(this).offset().left - $('#IntroDiv').offset().left + $(this).width()/2,
					$(this).offset().top - $('#IntroDiv').offset().top + $(this).height()/2
				);
				ripples.push(ripple);
				
				$('#IntroDiv *').addClass('MacchiatoOn');
			}
			else
			{
				ripples.forEach( 
					function(item, index)
					{
						$('#IntroDiv').hideRipple(item);
						$('#IntroDiv').remove(item);
						ripples.pop();
					}
				);
				
				$('#IntroDiv *').removeClass('MacchiatoOn');
			}
		}
	);
	
	// 科幻植物 Nav v-pill & tab
	$('#PottedPlantImage').hover(
		function()
		{
			$('#SwitchSpan').removeClass('SwitchSpanIdle');
			$('#SwitchSpan').addClass('SwitchSpanGlow');
		},
		function()
		{
			$('#SwitchSpan').removeClass('SwitchSpanGlow');
			$('#SwitchSpan').addClass('SwitchSpanIdle');
		}
	);
	$('#PottedPlantImage').click(
		function()
		{
			let state = $('#PlantsMonitor').attr('data-state');
			switch(state)
			{
				case '1st':
					$('#PlantsMonitor').attr('data-state', '2nd');
					break;
				case '2nd':
					$('#PlantsMonitor').attr('data-state', '3rd');
					break;
				case '3rd':
				default:
					$('#PlantsMonitor').attr('data-state', '1st');
					break;
			}
		}
	);
	
	// 焦糖瑪奇朵 - 時間
	window.setInterval(
		function ()
		{
			totalSec = moment
				.duration(
					moment().diff(moment(enterTime))
				).asSeconds();
			macchiatoSec = moment
				.duration(
					moment().diff(moment(enterMacchiatoTime))
				).asSeconds();
			
			$('#TotalTime').html('進入這個網站到現在過了' + totalSec.toFixed(3) + '秒');
			$('#MacchiatoTime').html('點進來看這杯焦糖瑪奇朵' + macchiatoSec.toFixed(3) +'秒了');
		}, 200
	);
});