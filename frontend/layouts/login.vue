<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 blur-3xl"></div>
        <div class="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-purple-400/10 blur-3xl"></div>
    </div>
    
    <div class="max-w-md w-full space-y-8 relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Layout for login page
</script>