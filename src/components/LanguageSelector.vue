<template>
  <!-- <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"> -->
  <div>
    <img
      src="https://flagcdn.com/w20/fr.png"
      srcset="https://flagcdn.com/w40/fr.png 2x"
      width="24"
      alt="France"
      title="Français"
      @click="$i18n.locale = 'fr'"
    />
    <img
      src="https://flagcdn.com/w20/us.png"
      srcset="https://flagcdn.com/w40/us.png 2x"
      width="24"
      height="16"
      alt="USA"
      title="English"
      @click="$i18n.locale = 'en'"
    />
  </div>
</template>

<style scoped>
img {
  cursor: pointer;
  margin-right: 5px;
}
</style>