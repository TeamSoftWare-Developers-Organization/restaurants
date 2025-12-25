<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>مرحباً، {{ userStore.user?.name || 'المستخدم' }}</h1>
      <p class="role-badge">{{ userStore.role }}</p>
    </header>

    <div class="dashboard-grid">
      <!-- قسم المدير -->
      <div v-if="userStore.isManager" class="role-section manager-section">
        <h2>لوحة المدير</h2>
        <div class="cards-wrapper">
          <div class="card">
            <h3>إدارة الموظفين</h3>
            <p>إضافة وتعديل بيانات الموظفين</p>
            <NuxtLink to="/employees" class="card-link">الذهاب</NuxtLink>
          </div>
          <div class="card">
            <h3>التقارير المالية</h3>
            <p>عرض المبيعات والأرباح</p>
            <NuxtLink to="/reports" class="card-link">الذهاب</NuxtLink>
          </div>
           <div class="card">
            <h3>قائمة الطعام</h3>
            <p>تعديل الأصناف والأسعار</p>
            <NuxtLink to="/menu" class="card-link">الذهاب</NuxtLink>
          </div>
        </div>
      </div>

      <!-- قسم الكاشير -->
      <div v-if="userStore.isCashier || userStore.isManager" class="role-section cashier-section">
        <h2>نقطة البيع (Cashier)</h2>
        <div class="cards-wrapper">
          <div class="card action-card">
            <h3>طلب جديد</h3>
            <p>إنشاء فاتورة جديدة للزبون</p>
            <NuxtLink to="/pos" class="card-link btn">بدء طلب</NuxtLink>
          </div>
          <div class="card">
            <h3>سجل الطلبات</h3>
            <p>مراجعة الطلبات السابقة</p>
            <NuxtLink to="/orders" class="card-link">عرض</NuxtLink>
          </div>
        </div>
      </div>

      <!-- قسم الطهاة -->
      <div v-if="userStore.isChef || userStore.isManager" class="role-section chef-section">
        <h2>المطبخ (Kitchen)</h2>
        <div class="cards-wrapper">
          <div class="card action-card">
            <h3>شاشة المطبخ (KDS)</h3>
            <p>عرض الطلبات الحالية للتحضير</p>
            <NuxtLink to="/kitchen" class="card-link btn">عرض الشاشة</NuxtLink>
          </div>
        </div>
      </div>

      <!-- قسم النادل -->
      <div v-if="userStore.isWaiter || userStore.isManager" class="role-section waiter-section">
        <h2>النوادل (Waiters)</h2>
        <div class="cards-wrapper">
          <div class="card">
             <h3>طاولاتي</h3>
             <p>إدارة الطاولات المسندة إليك</p>
             <NuxtLink to="/tables" class="card-link">عرض</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()


</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, sans-serif;
  direction: rtl;
}

.dashboard-header {
  margin-bottom: 3rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 2rem;
}

.role-badge {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.role-section {
  margin-bottom: 3rem;
}

.role-section h2 {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  border-right: 4px solid #3498db;
  padding-right: 10px;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.card p {
  color: #7f8c8d;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.card-link {
  display: inline-block;
  text-decoration: none;
  color: #3498db;
  font-weight: bold;
  align-self: flex-end; /* To align it to the right in RTL or left in LTR, but Flexbox direction matters */
}

/* Specific Styles for primary actions */
.action-card {
  border-top: 4px solid #3498db;
}

.btn {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #2980b9;
  color: white;
}
</style>
