/**
 * Rate Limiting Test Script
 * Run with: node test-rate-limit.mjs
 */

const API_URL = 'http://localhost:3000'

// Colors for console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testEndpoint(url, method = 'GET', body = null, expectedLimit) {
  log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue')
  log(`Testing: ${method} ${url}`, 'blue')
  log(`Expected Limit: ${expectedLimit} requests`, 'blue')
  log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'blue')

  let successCount = 0
  let rateLimitHit = false

  for (let i = 1; i <= expectedLimit + 5; i++) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      const headers = {
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining'),
        reset: response.headers.get('X-RateLimit-Reset'),
        retryAfter: response.headers.get('Retry-After')
      }

      if (response.status === 429) {
        rateLimitHit = true
        log(`✗ Request ${i}: RATE LIMITED (429)`, 'red')
        log(`  Retry After: ${headers.retryAfter} seconds`, 'yellow')
        log(`  Reset Time: ${new Date(parseInt(headers.reset) * 1000).toLocaleTimeString()}`, 'yellow')
        break
      } else if (response.ok) {
        successCount++
        log(`✓ Request ${i}: SUCCESS (${response.status}) - Remaining: ${headers.remaining}`, 'green')
      } else {
        log(`✗ Request ${i}: ERROR (${response.status})`, 'red')
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 50))
    } catch (error) {
      log(`✗ Request ${i}: FAILED - ${error.message}`, 'red')
    }
  }

  log(`\n📊 Results:`, 'blue')
  log(`   Success: ${successCount}`, successCount > 0 ? 'green' : 'red')
  log(`   Rate Limited: ${rateLimitHit ? 'Yes' : 'No'}`, rateLimitHit ? 'yellow' : 'green')
  log(`   Expected to succeed: ${expectedLimit}`, 'blue')
  log(`   Status: ${successCount === expectedLimit && rateLimitHit ? '✅ PASS' : '❌ FAIL'}`, 
    successCount === expectedLimit && rateLimitHit ? 'green' : 'red')
}

async function runTests() {
  log('\n╔════════════════════════════════════════╗', 'blue')
  log('║    RATE LIMITING TEST SUITE           ║', 'blue')
  log('╚════════════════════════════════════════╝', 'blue')

  try {
    // Test 1: Public API (RELAXED - 100/min)
    await testEndpoint(`${API_URL}/api/cars`, 'GET', null, 100)
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 2: Standard API (STANDARD - 30/min)
    await testEndpoint(`${API_URL}/api/inquiries`, 'GET', null, 30)
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 3: Auth API (AUTH - 5/5min)
    await testEndpoint(
      `${API_URL}/api/auth/login`, 
      'POST', 
      { email: 'test@test.com', password: 'wrongpass' }, 
      5
    )

    log('\n╔════════════════════════════════════════╗', 'green')
    log('║    ALL TESTS COMPLETED                ║', 'green')
    log('╚════════════════════════════════════════╝', 'green')

  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'red')
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/api/cars`)
    if (response.ok || response.status === 429) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

// Main
(async () => {
  log('\n🔍 Checking if server is running...', 'yellow')
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    log('\n❌ Server is not running!', 'red')
    log('Please start the server with: npm run dev', 'yellow')
    process.exit(1)
  }
  
  log('✅ Server is running\n', 'green')
  await runTests()
})()
