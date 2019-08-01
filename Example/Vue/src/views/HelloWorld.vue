<template>
	<div id="view"></div>
</template>

<script>
	let SoonSpace;
	export default {
		name: "hello-world",
		methods: {
			initScene() {
				SoonSpace = new this.$soonspace({
					el: "view"
				});
			},
			setBackgroundColor() {
				SoonSpace.setBackgroundColor("#ccc")
			},
			loadSBM() {
				const sbmInfo = {
					id: "Floor01",
					name: "1F",
					url: "./assets/ChaQingQi/ChaQingQi.sbm",
					useBufferGeometry: true,
					scale: 1.0,
					mapsUrl: "./assets/ChaQingQi/Maps/",
					baseFloor: "1"
				}
				// const sbmLoader = new SBMLoader()
				SoonSpace.loadSBM(sbmInfo)
					.then(res => {
						SoonSpace.scene.add(res)
					})
			}
		},
		mounted() {
			this.initScene()
			this.setBackgroundColor()
			this.loadSBM()
		}
	};
</script>
