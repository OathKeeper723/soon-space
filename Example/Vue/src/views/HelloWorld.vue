<template>
	<div id="view"></div>
</template>

<script>
  let SoonSpace
	export default {
		name: "hello-world",
		methods: {
			initScene() {
				SoonSpace = new this.$soonspace({
					el: "view"
        })
      },
      setBackgroundColor(){
        SoonSpace.setBackgroundColor("red")
      }
		},
		mounted() {
      this.initScene()
      this.setBackgroundColor()
    }
	}
</script>
