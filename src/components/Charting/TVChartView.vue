<script setup>
	import {
		onMounted,
		ref,
		onUnmounted,
		nextTick,
		watch
	} from 'vue';
	import {
		widget
	} from '../../../public/charting_library';
	// import { widget } from '../../../public/charting_library/charting_library.min'
	import {
		Datafeed
	} from "./datafeed";


	const props = defineProps({
		symbol: {
			default: 'BTC',
			type: String,
		},
		interval: {
			default: '5',
			type: String,
		},
		datafeedUrl: {
			default: 'https://demo_feed.tradingview.com',
			type: String,
		},
		libraryPath: {
			default: 'charting_library/',
			type: String,
		},
		chartsStorageUrl: {
			default: 'https://saveload.tradingview.com',
			type: String,
		},
		chartsStorageApiVersion: {
			default: '1.1',
			type: String,
		},
		clientId: {
			default: 'tradingview.com',
			type: String,
		},
		userId: {
			default: 'public_user_id',
			type: String,
		},
		fullscreen: {
			default: false,
			type: Boolean,
		},
		autosize: {
			default: true,
			type: Boolean,
		},
		studiesOverrides: {
			type: Object,
		},
	});

	const chartContainer = ref();
	let chartWidget;

	onMounted(() => {
		nextTick(() => {
			initView();
		})
	});

	// watch(theme_Key, () => {
	// 	// initView()
	// 	// widget.applyOverrides({ 'mainSeriesProperties.style': 3 })
	// 	if (theme_Key.value == 'light') {
	// 		chartWidget.onChartReady(() => {
	// 			chartWidget.changeTheme('Light')
	// 			chartWidget.applyOverrides({
	// 				'paneProperties.background': '#f9fbfe',
	// 				"paneProperties.backgroundType": "solid"
	// 			})
	// 		})
	// 	} else {
	// 		chartWidget.onChartReady(() => {
	// 			chartWidget.changeTheme('Dark')
	// 			setTimeout(() => {
	// 				chartWidget.applyOverrides({
	// 					'paneProperties.background': '#181818',
	// 					"paneProperties.backgroundType": "solid"
	// 				})
	// 			}, 100);

	// 		})
	// 	}
	// })

	const initView = () => {

		// console.log("chartContainer.value", chartContainer.value);

		const widgetOptions = {
			symbol: props.symbol,
			datafeed: new Datafeed(),
			// datafeed:new Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
			interval: '5',
			timezone: 'Asia/Shanghai',
			// container_id:'tv_chart_container',
			container: chartContainer.value,
			library_path: '/charting_library/',
			custom_css_url: "custom-styles.css",
			theme: 'dark',
			locale: 'en',
			disabled_features: [ "use_localstorage_for_settings",'header_quick_search', 'header_symbol_search',
				'header_compare', 'header_saveload', 'context_menus', 'symbol_search_hot_key', 'adaptive_logo',
				'header_screenshot', 'move_logo_to_main_pane', 'volume_force_overlay', 'symbol_info',"compare_symbol",
				'border_around_the_chart','timeframes_toolbar'
			],
			overrides: {
				volumePaneSize: 'medium',
				'paneProperties.topMargin': 10,
				'paneProperties.bottomMargin': 10,
				// 'paneProperties.vertGridProperties.color':getTheme('background_dark_light'), //tv网格颜色
				// 'paneProperties.horzGridProperties.color': getTheme('background_dark_light'),
				// "scalesProperties.textColor" : getTheme('color_main'),
				// "scalesProperties.lineColor": getTheme('background_dark'),
				'paneProperties.background': '#000', //k线图背景色
				"paneProperties.backgroundType": "solid",
				'paneProperties.backgroundGradientStartColor': "#000",
				'paneProperties.backgroundGradientEndColor': "#000",
				// "timeframesToolbar.timeframes": [
				// 	{ text: "1m", resolution: "1",title:'1m' },
				// 	{ text: "30m", resolution: "30" },
				// 	{ text: "1h", resolution: "1h" },
				// 	{ text: "5m", resolution: "5" },
				// ],
				// "timeframesToolbar.defaultExpanded": true,
				// "timeframesToolbar.visible": true,
				// "toolbarBg": "#ff0000",
				// "toolbarTextColor": "#ffffff", // 修改工具栏文字颜色
				// "toolbarIconColor": "#ffffff" // 修改工具栏图标颜色
				// "paneProperties.headerWidget.background": getTheme('background_dark'),
				// "timeAxisTickFormat": "%Y-%m-%d %H:%M" // 设置时间轴的日期格式
				// 'backgroundGradientStartColor':'#000',
				// 'backgroundGradientEndColor':'#000'
			},
			// toolbar_bg: getTheme('background_dark'),
			enabled_features: [],
			charts_storage_url: props.chartsStorageUrl,
			charts_storage_api_version: props.chartsStorageApiVersion,
			client_id: props.clientId,
			user_id: props.userId,
			fullscreen: props.fullscreen,
			autosize: props.autosize,
			studies_overrides: props.studiesOverrides,
		};
		chartWidget = new widget(widgetOptions);

		/*chartWidget.onIntervalChanged().subscribe(null, (interval, timeFrameParameters) => {
			console.log("onIntervalChanged", interval, timeFrameParameters);
		})*/

		console.log("11111111111111111111111111", chartWidget)
		chartWidget.onChartReady(() => {

			console.log("onChartReady")

			//chartWidget.activeChart().getAllStudies().forEach(({ name }) => console.log("getAllStudies",name));

			// streamInit();

			chartWidget.activeChart().createStudy("Volume", true);
			// chartWidget.activeChart().createStudy('MACD', true, false, [14, 30, "close", 9]);
			// chartWidget.activeChart().createStudy('Moving Average Exponential', false, false, [26])

			// chartWidget.headerReady().then(() => {
			// 	const button = chartWidget.createButton();

			// 	button.setAttribute('title', 'Click to show a notification popup');
			// 	button.classList.add('apply-common-tooltip');

			// 	button.addEventListener('click', () =>
			// 		chartWidget.showNoticeDialog({
			// 			title: 'Notification',
			// 			body: 'TradingView Charting Library API works correctly',
			// 			callback: () => {
			// 				// eslint-disable-next-line no-console
			// 				console.log('Noticed!');
			// 			},
			// 		})
			// 	);

			// 	button.innerHTML = 'Check API';
			// });
		});


	}

	onUnmounted(() => {
		if (chartWidget !== null) {
			chartWidget.remove();
			chartWidget = null;
		}
	});
</script>

<template>
	<div class="TVChartContainer modular" id="tv_chart_container" ref="chartContainer" />
</template>

<style scoped lang="scss">
	.TVChartContainer {
		flex: 1;
		overflow: hidden;
		height: 100%;
	}
</style>
