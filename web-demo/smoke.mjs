/* Runtime smoke test for the Gerardo web demo. */
import { chromium } from 'playwright-core'

const EXECUTABLE =
  process.env.BROWSER_PATH ||
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const BASE = 'http://localhost:5199/'

function log(step, ok, extra = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${step}${extra ? ' — ' + extra : ''}`)
  if (!ok) process.exitCode = 1
}

const browser = await chromium.launch({ executablePath: EXECUTABLE })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

// Fresh mock DB every run
await page.addInitScript(() => {
  localStorage.clear()
})

try {
  // 1. Portfolio + login render
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const welcome = page.locator('text=Bienvenid@ a Gerardo')
  await welcome.waitFor({ timeout: 10000 })
  log('Login screen renders', true)

  const hero = page.locator('text=Cuidado de adultos mayores')
  log('Portfolio hero renders', await hero.isVisible())

  // 2. Demo login → especialista
  await page.locator('button:has-text("Especialista")').first().click()
  await page
    .locator('input[placeholder="Buscar por nombre o cédula..."]')
    .waitFor({ timeout: 10000 })
  log('Especialista demo login → Pacientes', true)

  // 3. Patient detail (stack screen — no tab bar)
  await page.locator('button:has-text("Emilia Ramos Cañizares")').first().click()
  await page.locator('text=Información General').waitFor({ timeout: 8000 })
  log('Patient detail opens', true)

  // back to tabs
  await page.locator('[aria-label="Regresar"]').click()
  await page
    .locator('input[placeholder="Buscar por nombre o cédula..."]')
    .waitFor({ timeout: 8000 })
  log('Back from stack screen', true)

  // 4. Tabs: Dietas
  await page.locator('nav >> text=Dietas').click()
  await page.locator('input[placeholder="Buscar Dieta"]').waitFor({
    timeout: 8000,
  })
  log('Dietas tab', true)

  // 5. Diet detail
  await page
    .locator('button:has-text("Dieta para Diabetes Tipo 2")')
    .first()
    .click()
  await page.locator('text=Información de la Dieta').waitFor({ timeout: 8000 })
  log('Diet detail opens', true)

  await page.locator('[aria-label="Regresar"]').click()
  await page.locator('input[placeholder="Buscar Dieta"]').waitFor({
    timeout: 8000,
  })

  // 6. Alarmas tab + search
  await page.locator('nav >> text=Alarmas').click()
  await page
    .locator('input[placeholder="Buscar por cédula..."]')
    .fill('1194075221')
  await page.locator('text=Losartán 50 mg').first().waitFor({ timeout: 8000 })
  log('Alarm search by cédula', true)

  // 7. Logout
  await page.locator('nav >> text=Perfil').click()
  await page.locator('text=Cerrar Sesión').waitFor({ timeout: 8000 })
  await page.locator('button:has-text("Cerrar Sesión")').click()
  await page.locator('text=Bienvenid@ a Gerardo').waitFor({ timeout: 8000 })
  log('Logout returns to login', true)

  // 8. Paciente demo
  await page.locator('button:has-text("Paciente (adulta mayor)")').first().click()
  await page.locator('nav >> text=Medicamentos').click()
  await page.locator('text=Medicinas para hoy').waitFor({ timeout: 10000 })
  log('Paciente → Medicamentos', true)

  // 9. Food tracking
  await page.locator('nav >> text=Comidas').first().click()
  await page.locator('text=Más información sobre los tamaños').waitFor({ timeout: 8000 })
  log('Paciente → Comidas (dieta)', true)

  // 10. Meals grouped
  await page.locator('text=desayuno').first().waitFor({ timeout: 5000 })
  log('Meal groups render', true)

  // 11. Caregiver flow: logout then cuidador
  await page.locator('nav >> text=Perfil').click()
  await page.locator('button:has-text("Cerrar Sesión")').click()
  await page.locator('text=Bienvenid@ a Gerardo').waitFor({ timeout: 8000 })
  await page.locator('button:has-text("Cuidador")').first().click()
  await page.locator('nav >> text=Comidas').first().click()
  await page.locator('text=Ver Dieta de Paciente').waitFor({ timeout: 10000 })
  log('Cuidador → food tracking with picker', true)

  // select patient
  await page.locator('select').first().selectOption({ index: 1 })
  await page.locator('text=Más información sobre los tamaños').waitFor({ timeout: 8000 })
  log('Cuidador loads patient diet', true)

  // 12. Mark meal consumed (confirm modal)
  const mealCard = page
    .locator('button:has-text("Ensalada de pollo a la plancha")')
    .first()
  await mealCard.click()
  await page.locator('button:has-text("Confirmar")').waitFor({ timeout: 5000 })
  await page.locator('button:has-text("Confirmar")').click()
  await page.locator('text=Estado de comida actualizado').waitFor({
    timeout: 8000,
  })
  log('Mark meal consumed + toast', true)

  // screenshot
  await page.screenshot({ path: 'smoke-portfolio.png', fullPage: false })
  log('Screenshot saved', true)
} catch (err) {
  log(`Exception: ${err.message}`, false)
  await page.screenshot({ path: 'smoke-failure.png' }).catch(() => {})
} finally {
  await browser.close()
}
