# JAMMAL FREIGHT PLATFORM - COMPREHENSIVE TECHNICAL REQUIREMENTS DOCUMENT

## PROJECT OVERVIEW

**Project Name:** Jammal (جمّال)  
**Platform Type:** Cross-platform mobile application + responsive web platform  
**Purpose:** Freight shipping marketplace connecting shippers, truck drivers/owners, and freight brokers in Saudi Arabia  
**Target Market:** Kingdom of Saudi Arabia - Domestic freight transport

---

## 1. SYSTEM ARCHITECTURE

### 1.1 Technology Stack

**Frontend - Mobile Applications:**
- **Framework:** React Native (iOS + Android) OR Flutter
- **State Management:** Redux Toolkit / MobX / Riverpod
- **Maps Integration:** Google Maps SDK for both platforms
- **Real-time Communication:** Socket.io / Firebase Realtime Database
- **Push Notifications:** Firebase Cloud Messaging (FCM) + Apple Push Notification Service (APNS)
- **Payment Integration:** Hyperpay / Moyasar / Tap Payments (Saudi payment gateways)
- **Localization:** i18n for Arabic (RTL) and English support

**Frontend - Web Application:**
- **Framework:** React.js / Next.js (for SEO and SSR)
- **UI Library:** Material-UI / Ant Design / Tailwind CSS
- **State Management:** Redux Toolkit
- **Maps:** Google Maps JavaScript API
- **Real-time:** Socket.io client
- **Responsive Design:** Mobile-first approach, fully responsive

**Backend:**
- **Runtime:** Node.js with Express.js OR Django (Python) OR Laravel (PHP)
- **API Architecture:** RESTful API + GraphQL (optional for complex queries)
- **Real-time Engine:** Socket.io / WebSocket
- **Authentication:** JWT (JSON Web Tokens) + OAuth 2.0
- **File Storage:** AWS S3 / Google Cloud Storage
- **Email Service:** SendGrid / AWS SES
- **SMS Service:** Twilio / Unifonic (local Saudi provider)

**Database:**
- **Primary Database:** PostgreSQL / MySQL (relational data)
- **Cache Layer:** Redis (sessions, real-time data)
- **Search Engine:** Elasticsearch (for advanced search)
- **File Storage:** AWS S3 or similar cloud storage

**Infrastructure:**
- **Hosting:** AWS / Google Cloud Platform / Microsoft Azure
- **CDN:** Cloudflare / AWS CloudFront
- **Containerization:** Docker + Kubernetes
- **CI/CD:** GitHub Actions / GitLab CI / Jenkins
- **Monitoring:** Sentry (error tracking), New Relic / DataDog (performance)

---

## 2. USER ROLES & PERSONAS

### 2.1 Three Primary User Types

1. **Customer/Shipper** - Individual or business needing freight transport
2. **Driver/Truck Owner** - Individual with vehicle offering transport services
3. **Freight Broker** - Professional intermediary managing multiple shipments

### 2.2 Additional Roles

4. **Admin** - Platform administrator with full system access
5. **Support Agent** - Customer service representative

---

## 3. REGISTRATION & AUTHENTICATION SYSTEM

### 3.1 Registration Flow

**For All Users (Common Steps):**

1. **Initial Registration Screen:**
   - Select user type: Customer / Driver / Broker
   - Input fields:
     - Full Name (Arabic & English)
     - Mobile Number (primary identifier in Saudi Arabia)
     - Email Address
     - Password (min 8 characters, must include uppercase, lowercase, number, special character)
     - Confirm Password
     - Accept Terms & Conditions checkbox
     - Accept Privacy Policy checkbox

2. **Mobile Verification (Critical for Saudi market):**
   - Send OTP via SMS to mobile number
   - 6-digit verification code
   - 2-minute expiration time
   - Resend option after 30 seconds
   - Store verification status in database

3. **Email Verification:**
   - Send verification email with clickable link
   - Token-based verification (expires in 24 hours)
   - Email confirmed status in database

### 3.2 Role-Specific Additional Registration

**For Drivers/Truck Owners:**

Required Documents Upload:
- **National ID / Iqama:** Front and back photos
- **Driver's License:** Valid Saudi driving license (front & back)
- **Vehicle Registration (Istimara):** Current vehicle registration
- **Vehicle Insurance (Taamin):** Active insurance certificate
- **Vehicle Photos:** Minimum 4 photos (front, back, both sides, cargo area)
- **Commercial Registration (if company):** CR certificate

Additional Information:
- Vehicle Type: Select from dropdown (pickup truck, lorry, trailer, refrigerated, etc.)
- Vehicle Capacity: Weight capacity in tons
- Vehicle Length: In meters
- Vehicle License Plate Number
- Vehicle Model & Year
- Availability Schedule: Default working hours
- Service Areas: Select cities/regions willing to service
- Banking Information: IBAN for payments

**For Freight Brokers:**

Required Documents:
- **Commercial Registration (CR):** Mandatory
- **National Address:** Registered business address
- **Tax Certificate:** VAT registration if applicable
- **Owner ID:** Owner's national ID
- **Business License:** Freight brokerage license if required by authorities

Additional Information:
- Company Name (Arabic & English)
- Business Type: Individual / Company
- Number of Drivers in Network (optional)
- Service Coverage Area
- Banking Information: Company IBAN

**For Customers:**

Minimal Requirements (can ship immediately after verification):
- Mobile and email verification only
- Optional: National ID for business accounts
- Optional: Company information for corporate accounts

### 3.3 Document Verification Process

**Backend Verification Workflow:**

1. **Automatic Checks:**
   - Image quality verification
   - Document expiry date extraction (OCR)
   - National ID format validation (Saudi ID patterns)
   - License plate format validation

2. **Manual Review:**
   - Admin dashboard queue for document review
   - Approve/Reject with reason
   - Request re-upload if needed
   - Verification status: Pending / Approved / Rejected

3. **Status Notifications:**
   - Push notification on approval/rejection
   - SMS notification for critical updates
   - Email notification with detailed information

### 3.4 Login System

**Login Methods:**

1. **Primary Login:**
   - Mobile number + Password
   - Alternative: Email + Password

2. **Social Login (Optional):**
   - Apple Sign-In (required for iOS)
   - Google Sign-In
   - Auto-link to existing account if email matches

3. **Biometric Login (Mobile App):**
   - Face ID (iOS)
   - Touch ID (iOS)
   - Fingerprint (Android)
   - Store encrypted token locally

4. **Remember Me:**
   - Persistent session for 30 days
   - Automatic logout on password change

**Security Features:**

- Account lockout after 5 failed attempts (30-minute cooldown)
- Password reset via SMS OTP or email link
- Two-factor authentication (optional, recommended for brokers)
- Device tracking and suspicious login alerts
- Session management (view active sessions, remote logout)

---

## 4. CUSTOMER USER EXPERIENCE

### 4.1 Customer Dashboard

**Main Dashboard Components:**

1. **Header:**
   - Logo
   - Notification bell icon (with unread count badge)
   - Profile picture/avatar
   - Wallet balance (if prepaid system)

2. **Quick Actions:**
   - "Create New Shipment" prominent button
   - "Track My Shipments" button
   - "Saved Addresses" button
   - "Frequent Routes" shortcuts

3. **Active Shipments Section:**
   - Cards showing ongoing shipments
   - Each card displays:
     - Shipment ID
     - Origin → Destination
     - Current status (Searching for Driver / Driver Assigned / In Transit / Delivered)
     - Driver name and rating (if assigned)
     - Live tracking button
     - Estimated delivery time
     - Contact driver button

4. **Shipment History:**
   - List/grid view toggle
   - Filter options: Date range, status, price range
   - Search by shipment ID or location
   - Downloadable invoices

5. **Statistics (if multiple shipments):**
   - Total shipments completed
   - Total amount spent
   - Favorite drivers
   - Most used routes

### 4.2 Create Shipment Flow

**Step 1: Shipment Details**

Pickup Information:
- Pickup Address: Auto-complete with Google Places API
- Pickup Contact Name
- Pickup Contact Phone
- Pickup Date: Date picker
- Pickup Time: Time picker or "Flexible" option
- Floor Number / Building Details
- Special Instructions (e.g., "Call upon arrival")

Delivery Information:
- Delivery Address: Auto-complete
- Delivery Contact Name
- Delivery Contact Phone
- Preferred Delivery Date: Date picker
- Preferred Delivery Time: Time range or "Anytime"
- Floor Number / Building Details
- Special Instructions

**Step 2: Cargo Details**

Cargo Information:
- Cargo Type: Dropdown (Furniture, Electronics, Food, Construction Materials, General Goods, etc.)
- Cargo Description: Text area (max 500 characters)
- Estimated Weight: Input in KG with slider
- Cargo Dimensions: Length x Width x Height (cm)
- Quantity/Number of Items
- Special Handling: Checkboxes (Fragile, Refrigerated, Hazardous, Heavy Machinery, etc.)

Photos:
- Upload up to 10 photos of cargo
- Image compression on upload
- Preview before submission

Insurance:
- Optional cargo insurance
- Select insured value
- Insurance premium auto-calculated (e.g., 2% of value)

**Step 3: Vehicle Requirements**

Vehicle Selection:
- Vehicle Type Required: Checkboxes (Pickup Truck, Small Lorry, Medium Lorry, Large Truck, Refrigerated, Flatbed, etc.)
- Minimum Vehicle Capacity: Dropdown in tons
- Additional Requirements: (Ramp, Crane, Helper, Multiple Stops, etc.)

**Step 4: Pricing & Payment**

Pricing Options:
- **Option A: Request Quotes**
  - Post shipment for drivers to bid
  - Set maximum acceptable price (optional)
  - Receive bids for 30 minutes / 1 hour / until manually selected
  
- **Option B: Instant Quote**
  - System calculates suggested price based on:
    - Distance (Google Maps API)
    - Weight and dimensions
    - Vehicle type required
    - Date/time (surge pricing if applicable)
  - Display price breakdown
  - "Book Now" at suggested price

Payment Method Selection:
- Credit/Debit Card (saved cards or new)
- Apple Pay / STC Pay / Mada
- Cash on Delivery (if enabled)
- Corporate Account / Invoice (for verified businesses)
- Wallet Balance (if prepaid system)

**Step 5: Review & Confirm**

Summary Screen:
- All details displayed clearly
- Edit buttons for each section
- Estimated total cost
- Terms of service agreement
- "Confirm & Create Shipment" button

Post-Submission:
- Success message with shipment ID
- Redirect to shipment tracking screen
- Push notification sent
- SMS confirmation sent

### 4.3 Shipment Matching & Bidding System

**If "Request Quotes" Selected:**

1. **Broadcasting:**
   - Shipment posted to all available drivers in the area
   - Drivers within 50km radius notified first, then expanding
   - Push notifications to eligible drivers

2. **Bid Display for Customer:**
   - List of incoming bids in real-time
   - Each bid shows:
     - Driver name and profile photo
     - Driver rating (stars out of 5)
     - Number of completed trips
     - Proposed price
     - Vehicle type and license plate
     - Vehicle photos
     - Estimated pickup time
     - Message from driver (optional)
   - Sort options: Price (low to high), Rating (high to low), Response time

3. **Selection:**
   - Customer reviews bids
   - Can message driver before accepting
   - "Accept Bid" button
   - Auto-cancellation of other bids
   - Payment hold/authorization

**If "Instant Quote" Selected:**

1. **Automatic Matching:**
   - System finds available drivers matching criteria
   - Sorted by rating and proximity
   - Automatic assignment to highest-rated nearest driver
   - Driver has 2 minutes to accept or decline
   - If declined, offer to next driver in queue

### 4.4 Live Tracking

**Tracking Screen Features:**

Map View:
- Full-screen Google Maps
- Customer location marker (pickup)
- Driver current location (real-time GPS)
- Destination marker (delivery)
- Polyline showing route
- Traffic layer overlay (optional)
- ETA continuously updated

Status Timeline:
- Visual progress bar/timeline showing:
  - ✓ Shipment Created
  - ✓ Driver Assigned
  - → Driver En Route to Pickup (with ETA)
  - → Cargo Loaded (driver confirms with photo)
  - → In Transit to Destination (with ETA)
  - → Delivered (with proof of delivery photo)

Driver Information Card:
- Driver photo and name
- Vehicle type and license plate
- Rating and trips completed
- "Call Driver" button (in-app VoIP or regular call)
- "Message Driver" button (in-app chat)

Real-time Updates:
- Push notifications at each status change
- SMS for critical updates (pickup, delivery)
- Automatic refresh every 10 seconds

**Proof of Delivery:**
- Driver uploads photo at delivery
- Customer signs on driver's device (digital signature)
- Timestamp and GPS coordinates logged
- Customer receives proof in their account

### 4.5 Rating & Review System

**After Delivery Completion:**

Rating Screen (appears automatically):
- Rate Driver: 1-5 stars (mandatory)
- Rate Vehicle Condition: 1-5 stars
- Rate Punctuality: 1-5 stars
- Rate Cargo Handling: 1-5 stars
- Written Review: Text area (optional, max 500 characters)
- Photo Upload: Evidence of issues (optional)

Review Submission:
- Reviews published after moderation (if needed)
- Driver notified of new review
- Rating affects driver's overall score immediately

### 4.6 Customer Support Features

Support Access:
- In-app chat support (live chat widget)
- FAQ section with search
- Submit ticket with file attachments
- Phone support (click-to-call)
- Email support

Issue Reporting:
- Report damaged cargo
- Report missing items
- Report driver issues
- Dispute charges
- Request refund

Help Center:
- How to create shipment guide
- Payment methods explanation
- Pricing calculator
- Terms and conditions
- Insurance information

---

## 5. DRIVER/TRUCK OWNER EXPERIENCE

### 5.1 Driver Dashboard

**Main Dashboard Components:**

1. **Status Toggle:**
   - Large "Available / Offline" switch
   - Current earnings today prominently displayed
   - Trips completed today

2. **Map View:**
   - Current location displayed
   - Nearby shipment requests as markers
   - Distance to each request shown
   - Tap marker to view shipment details

3. **Shipment Requests Feed:**
   - List view of available shipments
   - Each card shows:
     - Pickup location → Delivery location
     - Distance from driver's current location
     - Estimated payout (if instant quote)
     - Cargo type and weight
     - Time until pickup
     - "View Details" button
     - Quick actions: Bid / Accept / Ignore

4. **Today's Schedule:**
   - Calendar view of accepted trips
   - Timeline showing pickup and delivery times
   - Route optimization suggestions

5. **Earnings Summary:**
   - This week's earnings
   - This month's earnings
   - Graph showing daily earnings trend
   - Pending payments
   - Payment history

6. **Performance Metrics:**
   - Overall rating (stars)
   - Total trips completed
   - Acceptance rate
   - Cancellation rate
   - On-time delivery rate

### 5.2 Accepting & Managing Shipments

**Viewing Shipment Request:**

Detailed View:
- Pickup address with "Navigate" button (opens in Google Maps/Waze)
- Delivery address with "Navigate" button
- Estimated total distance
- Cargo details with photos
- Special requirements
- Customer name and rating (if available)
- Preferred pickup time
- Suggested price (if instant quote)

Actions:
- **Accept Shipment** (if instant quote)
- **Place Bid** (if bidding mode)
- **Decline** with optional reason
- **Contact Customer** before accepting

**Placing a Bid:**

Bid Form:
- Suggested price displayed
- Input custom bid amount
- Add optional message to customer
- Estimated profit after platform commission shown
- "Submit Bid" button
- Bid valid for specified time

Bid Management:
- View all active bids
- Edit bid before customer accepts
- Withdraw bid
- Notification when bid accepted/rejected

**After Acceptance:**

Trip Preparation:
- Trip details saved in "Active Trips"
- Navigation to pickup location
- Estimated arrival time to pickup
- "Notify Customer" button (sends "I'm on my way" message)
- Checklist: Vehicle inspection, cargo space ready, etc.

### 5.3 Trip Execution Flow

**Step 1: En Route to Pickup**

Features:
- Navigation active
- Traffic updates
- "I'm Running Late" button (notifies customer)
- "Call Customer" button
- ETA countdown

**Step 2: At Pickup Location**

Actions:
- "I've Arrived" button (notifies customer)
- Wait time tracker (if customer late)
- Upload photos of cargo before loading (proof of condition)
- Verify cargo against description
- "Report Issue" if cargo doesn't match
- "Cargo Loaded" button to proceed

Cargo Verification:
- Compare photos with description
- Verify weight and dimensions
- Check for special handling requirements
- Digital checklist

**Step 3: In Transit**

Features:
- Navigation to delivery
- Real-time GPS sharing with customer
- Multiple waypoints (if multiple deliveries)
- "Rest Stop" button (pauses timer)
- Toll/expense tracker
- Emergency button

**Step 4: At Delivery Location**

Actions:
- "I've Arrived" button
- Upload delivery photos (proof of delivery)
- Collect customer signature (digital signature on screen)
- "Delivery Complete" button
- Option to report issues (damage, refusal to accept, etc.)

Proof of Delivery:
- Photo of cargo at destination
- Photo showing cargo placement
- GPS coordinates logged
- Timestamp recorded
- Customer signature captured
- Optional: Customer ID photo (for high-value items)

**Step 5: Trip Completion**

Final Actions:
- Earnings added to driver account
- Request customer rating
- View trip summary
- Download trip receipt
- Payment processing notification

### 5.4 Driver Earnings & Payments

**Earnings Dashboard:**

Overview:
- Total available balance
- Today's earnings
- This week's earnings
- This month's earnings
- Projected monthly income based on average

Earnings Breakdown:
- Per-trip earnings list
- Platform commission deducted (e.g., 15%)
- Bonuses earned (if any)
- Tips received (if feature enabled)
- Cancelled trip fees (if customer cancelled after acceptance)

**Payment Withdrawal:**

Withdrawal Options:
- Bank transfer (IBAN)
- Minimum withdrawal amount: 100 SAR
- Processing time: 1-3 business days
- Weekly auto-payout option (every Sunday)
- Instant payout (with small fee, e.g., 2%)

Payment History:
- Transaction log
- Downloadable statements
- Tax information for year-end

**Incentives & Bonuses:**

Bonus System:
- Peak hours multiplier (e.g., 1.5x on Friday afternoons)
- Completion bonuses (e.g., 50 SAR for 10 trips/week)
- High rating bonuses
- Referral bonuses for bringing new drivers
- Long-distance trip bonuses

### 5.5 Driver Profile & Settings

**Profile Management:**

Editable Information:
- Profile photo
- Bio/Introduction (visible to customers)
- Service areas (cities/regions)
- Languages spoken
- Availability schedule (recurring calendar)

Vehicle Management:
- Add multiple vehicles
- Switch active vehicle
- Update vehicle documents (renewal reminders)
- Vehicle maintenance log
- Vehicle photos update

Availability Settings:
- Set working hours
- Block specific dates (vacation mode)
- Auto-decline shipments outside service area
- Maximum distance willing to travel
- Preferred cargo types

Notification Preferences:
- Push notifications on/off
- SMS notifications on/off
- Email notifications on/off
- Notification sound settings
- Do Not Disturb hours

### 5.6 Driver Support & Resources

**Help Center:**
- How to use the app tutorial
- Best practices for loading cargo
- Customer service tips
- Safety guidelines
- FAQ section

**Support Channels:**
- In-app chat with support team
- Phone support for emergencies
- Submit tickets for account issues
- Report platform bugs

**Community:**
- Driver forum (optional)
- Tips from top-rated drivers
- News and updates
- Local driver meetups info

---

## 6. FREIGHT BROKER EXPERIENCE

### 6.1 Broker Dashboard

**Advanced Dashboard Features:**

1. **Multi-Shipment Management:**
   - Table view of all active shipments
   - Columns: ID, Customer, Origin, Destination, Status, Driver, ETA, Price
   - Bulk actions: Assign drivers, cancel, export
   - Advanced filters: Date, status, customer, driver, price range
   - Search functionality

2. **Fleet Management:**
   - List of drivers in broker's network
   - Driver availability status
   - Current assignments
   - Performance metrics per driver
   - Add/remove drivers from network

3. **Customer Management:**
   - CRM-style customer list
   - Contact history
   - Shipment history per customer
   - Custom pricing contracts
   - Saved quotes

4. **Financial Dashboard:**
   - Revenue overview (daily, weekly, monthly)
   - Commission earned
   - Pending payments
   - Payment collection status
   - Expense tracking
   - Profit margins per shipment

5. **Analytics & Reports:**
   - Shipment volume graphs
   - Revenue trends
   - Driver performance comparison
   - Customer retention rates
   - Popular routes analysis
   - Exportable reports (PDF, Excel)

### 6.2 Broker Shipment Creation

**Enhanced Creation Flow:**

Additional Options for Brokers:
- Create shipment on behalf of customer
- Assign to specific driver in network
- Set custom pricing (override system suggestion)
- Create recurring shipments (weekly, monthly)
- Bulk upload shipments via CSV
- Split large shipments across multiple drivers

Customer Assignment:
- Select existing customer from database
- Create new customer profile on-the-fly
- Auto-fill contact information

### 6.3 Broker-Specific Features

**Driver Network Management:**

Add Drivers:
- Send invitation to drivers
- Approval process for incoming driver requests
- Set commission split with driver (e.g., 70-30)
- Assign drivers to specific routes/regions

Driver Assignments:
- Manual assignment to shipments
- Automatic assignment based on rules
- Override system assignments
- Priority drivers for VIP customers

**Custom Pricing:**

Price Management:
- Create customer-specific pricing tables
- Set volume discounts
- Contract management with fixed prices
- Dynamic pricing rules
- Margin control

**Quotes & Proposals:**

Create Quotes:
- Generate formal quotes for customers
- Itemized pricing breakdown
- Valid until date
- PDF export with company branding
- Email directly to customer

Quote Tracking:
- Pending quotes list
- Accepted/rejected quotes
- Follow-up reminders

### 6.4 Broker Communication Tools

**Multi-Channel Communication:**

In-App Messaging:
- Chat with customers
- Chat with drivers
- Group chats for specific shipments
- Broadcast messages to driver network
- Saved message templates

External Communication:
- Email integration
- WhatsApp Business API integration (if available)
- SMS campaigns
- Automated status updates

**Notifications:**

Custom Notification Rules:
- Alert on new shipment requests
- Alert on driver issues
- Alert on payment failures
- Daily summary emails
- Custom triggers

---

## 7. PAYMENT & FINANCIAL SYSTEM

### 7.1 Payment Flow Architecture

**For Customers:**

Payment Authorization:
1. Customer creates shipment
2. Payment method selected
3. Amount authorized/held (not charged)
4. Escrow system holds funds
5. Funds released upon successful delivery
6. Customer charged, driver paid

Payment Methods:
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Mada (Saudi debit cards)
- Apple Pay / STC Pay
- Bank Transfer (for business accounts)
- Corporate Invoicing (NET 30 terms for approved businesses)
- Cash on Delivery (driver collects, remits to platform)

**For Drivers:**

Payout Methods:
- Bank transfer to IBAN
- Weekly automatic payouts
- Manual withdrawal requests
- Minimum threshold for withdrawal

Payout Schedule:
- Earnings available after delivery confirmation
- 24-hour hold period for fraud prevention
- Released to available balance
- Withdrawable according to schedule

**For Brokers:**

Payment Collection:
- Customer payments collected by platform
- Broker commission calculated automatically
- Payouts on regular schedule
- Detailed commission statements

### 7.2 Pricing Engine

**Dynamic Pricing Algorithm:**

Base Price Calculation:
```
Base Price = (Distance in KM × Rate per KM) + Base Fare
```

Factors Affecting Price:
- **Distance:** Primary factor, calculated via Google Maps API
- **Weight:** Graduated scale (0-500kg, 501-1000kg, 1001-2000kg, 2000kg+)
- **Vehicle Type:** Multiplier (pickup truck 1x, small lorry 1.5x, large truck 2.5x, etc.)
- **Cargo Type:** Fragile +10%, Refrigerated +25%, Hazardous +50%
- **Time of Day:** Peak hours +20% (Thursday/Friday afternoons)
- **Distance Bands:** 
  - 0-50km: Base rate
  - 51-150km: -10% per KM (better rate for medium distance)
  - 150km+: -15% per KM (best rate for long haul)
- **Seasonality:** Ramadan +15%, Eid periods +30%
- **Demand:** Surge pricing when demand > supply in area

Price Display:
- Always show price breakdown
- Transparency in all fees
- No hidden charges
- Comparison with average price for similar shipments

### 7.3 Commission Structure

**Platform Commission:**

Standard Rates:
- Customer Shipments: 15% of total
- Broker Shipments: 10% of total
- New Driver Promotion: 10% for first month
- High-volume Discount: 12% if 100+ trips/month

Commission Display:
- Drivers see commission-deducted amount upfront
- Brokers see margin calculations
- Transparent fee structure in app

**Additional Fees:**

Platform Fees:
- Payment processing: 2.9% + 1 SAR (standard card fee)
- Instant payout: 2% of withdrawal amount
- Subscription plans (optional): Premium driver 99 SAR/month (reduced commission to 12%)
- Insurance: 2-5% of declared value

### 7.4 Refunds & Disputes

**Refund Policy:**

Eligible Scenarios:
- Shipment cancelled by driver after acceptance (full refund)
- Cargo damaged by driver (partial/full based on claim)
- Driver no-show (full refund + compensation credit)
- Service not as described

Refund Process:
1. Customer submits refund request
2. Upload evidence (photos, descriptions)
3. Admin review within 24-48 hours
4. Approval/rejection with reason
5. Refund processed to original payment method
6. 5-10 business days for credit/debit cards

**Dispute Resolution:**

Dispute Types:
- Pricing disputes
- Damaged cargo claims
- Service quality complaints
- Payment issues

Resolution Process:
1. In-app dispute form
2. Both parties provide evidence
3. Admin mediation
4. Decision within 5 business days
5. Resolution action (refund, compensation, driver penalty, etc.)

---

## 8. REAL-TIME TRACKING & GPS SYSTEM

### 8.1 GPS Tracking Implementation

**Technical Requirements:**

Driver App:
- Background GPS tracking (even when app minimized)
- Location update interval: Every 10 seconds while in active trip
- Batch updates if connectivity poor
- Store location history locally and sync
- Battery optimization mode

Backend Processing:
- Receive GPS coordinates via WebSocket/REST API
- Store in time-series database (Timescale DB or similar)
- Process and forward to customer in real-time
- Calculate ETA based on current location + traffic
- Alert system for deviations from route

Customer View:
- Real-time marker updates (smooth animation)
- Polyline route display
- Traffic layer
- ETA recalculation every 30 seconds

### 8.2 Route Optimization

**Features:**

Multi-Stop Optimization:
- If driver has multiple pickups/deliveries
- Calculate optimal route order
- Minimize total distance and time
- Consider time windows for each stop

Navigation Integration:
- "Start Navigation" opens Google Maps or Waze
- Deep linking with destination coordinates
- Alternative routes display
- Traffic-aware routing

### 8.3 Geofencing

**Geofence Implementation:**

Pickup Geofence:
- Automatic detection when driver enters 100m radius of pickup
- Trigger "Driver Nearby" notification to customer
- Enable "I've Arrived" button

Delivery Geofence:
- Automatic detection when entering delivery area
- Trigger "Driver Nearby" notification
- Enable "Delivery Complete" button

Use Cases:
- Prevent premature delivery confirmation (must be within geofence)
- Fraud prevention
- Automatic status updates

---

## 9. NOTIFICATION SYSTEM

### 9.1 Notification Types

**Push Notifications:**

For Customers:
- New bid received on shipment
- Driver assigned to shipment
- Driver en route to pickup
- Driver arrived at pickup
- Cargo loaded
- Driver en route to delivery
- Driver arrived at delivery
- Delivery completed
- Rating reminder
- Payment receipt
- Refund processed

For Drivers:
- New shipment request in area
- Bid accepted
- Shipment cancelled by customer
- Payment received
- Rating received
- Document expiring soon
- Maintenance reminder
- Promotional offers

For Brokers:
- New customer inquiry
- Shipment status updates
- Driver assigned
- Payment received
- Low performing driver alert

**SMS Notifications:**

Critical Events Only:
- OTP verification codes
- Shipment confirmed
- Driver assigned
- Delivery completed
- Payment confirmation
- Security alerts

**Email Notifications:**

Detailed Information:
- Registration confirmation
- Document verification status
- Weekly summary reports
- Monthly invoices
- Password reset
- Account changes
- Promotional campaigns

**In-App Notifications:**

Notification Center:
- All notifications history
- Read/unread status
- Action buttons (view shipment, respond, etc.)
- Filter by type
- Clear all option

### 9.2 Notification Preferences

**User Controls:**

Granular Settings:
- Enable/disable by type
- Enable/disable by channel (push, SMS, email)
- Quiet hours (no push between 10 PM - 7 AM)
- Critical only mode
- Do Not Disturb mode

---

## 10. RATING & REVIEW SYSTEM

### 10.1 Customer Rating of Driver

**Rating Components:**

Multi-Dimensional Rating:
1. Overall Experience (1-5 stars, mandatory)
2. Punctuality (1-5 stars)
3. Vehicle Cleanliness (1-5 stars)
4. Cargo Handling (1-5 stars)
5. Professionalism (1-5 stars)

Written Review:
- Text area (max 500 characters)
- Optional but encouraged
- Moderation before publishing (check for profanity, abuse)

Photo Evidence:
- Upload photos to support review (if negative)
- Maximum 5 photos

Tags:
- Quick selection of predefined tags:
  - Positive: "Friendly", "Careful", "On Time", "Great Communication"
  - Negative: "Late", "Rude", "Careless Driving", "Damaged Cargo"

**Rating Submission:**

Timing:
- Prompt appears immediately after delivery confirmation
- Can be skipped and done later via shipment history
- Reminder push notification after 24 hours if not rated

Processing:
- Rating instantly updates driver's overall score
- Written review held for moderation (24 hours)
- Driver notified of new rating

### 10.2 Driver Rating of Customer

**Rating Components:**

Driver Rates Customer:
1. Overall Experience (1-5 stars)
2. Clear Instructions (1-5 stars)
3. Cargo as Described (1-5 stars)
4. Payment Promptness (1-5 stars)

Written Review:
- Optional feedback
- Visible only to platform admins (not public)
- Used for customer behavior tracking

### 10.3 Rating Display & Impact

**Driver Profile:**

Display:
- Overall average rating (out of 5)
- Total number of ratings
- Star distribution chart (X number of 5-star, 4-star, etc.)
- Recent reviews (latest 10)
- Filter reviews by rating

Impact on Driver:
- Drivers below 3.5 stars receive warning
- Drivers below 3.0 stars suspended pending review
- High ratings (4.5+) get priority in matching algorithm
- Top rated drivers badge

**Customer Profile:**

Display (visible to drivers only):
- Overall rating from drivers
- Number of shipments completed
- Used to help drivers decide to accept shipment

---

## 11. IN-APP MESSAGING SYSTEM

### 11.1 Chat Features

**Real-Time Chat:**

Technical Implementation:
- WebSocket connection for real-time messaging
- Message delivered/read receipts
- Typing indicators
- Message history stored in database

Chat Interface:
- WhatsApp-style chat bubbles
- Timestamp for each message
- Customer messages: Right side (blue)
- Driver messages: Left side (gray)
- System messages: Center (yellow, e.g., "Driver has been assigned")

Message Types:
- Text messages
- Photo sharing (cargo photos, delivery proof)
- Location sharing (send current location pin)
- Quick replies (pre-defined responses like "I'm on my way", "Running 10 minutes late")

**Chat Availability:**

When Active:
- Chat enabled only for active shipments
- Customer ↔ Driver chat
- Customer ↔ Support
- Broker ↔ Driver
- Broker ↔ Customer

Archive:
- Chat history saved per shipment
- Accessible in shipment details after completion
- Used for dispute resolution

### 11.2 Support Chat

**Customer Support Chat:**

Features:
- Live chat with support agents
- Business hours: 9 AM - 9 PM
- Outside hours: Leave message, response within 12 hours
- File attachments support (screenshots, documents)
- Canned responses for common questions
- Escalation to phone support if needed

Bot Integration (Optional):
- AI chatbot for FAQs
- Auto-suggestions while typing
- Seamless handoff to human agent

---

## 12. ADMIN PANEL (WEB-BASED)

### 12.1 Admin Dashboard Overview

**Main Dashboard:**

Key Metrics:
- Total users (breakdown: customers, drivers, brokers)
- Active shipments right now
- Today's shipments (completed, ongoing, cancelled)
- Today's revenue
- This month's revenue vs. last month
- Platform commission earned
- Average shipment value
- Average delivery time

Charts:
- Revenue trend (line chart, last 30 days)
- Shipments volume (bar chart, last 30 days)
- User growth (line chart)
- Top performing drivers
- Most active customers
- Busiest routes

Quick Actions:
- View pending verifications
- View open support tickets
- View active disputes
- System health check

### 12.2 User Management

**Customer Management:**

List View:
- All customers table
- Columns: ID, Name, Email, Phone, Join Date, Total Shipments, Total Spent, Status
- Search and filters
- Export to CSV

Customer Details:
- Full profile information
- Shipment history
- Payment history
- Ratings given
- Account status (Active / Suspended / Banned)
- Actions: View details, Suspend, Delete, Send message

**Driver Management:**

List View:
- All drivers table
- Columns: ID, Name, Phone, Vehicle Type, Rating, Total Trips, Status, Verification Status
- Filters: Verification status, rating, activity status

Driver Details:
- Personal information
- Vehicle information
- Documents (view uploaded docs)
- Verification status
- Trip history
- Earnings history
- Ratings and reviews received
- Actions: Approve, Reject, Suspend, Delete

Document Verification:
- Queue of pending document verifications
- Side-by-side view of uploaded documents
- Approve/Reject buttons
- Request re-upload with reason
- Bulk actions

**Broker Management:**

Similar to driver management
- Company information
- Managed drivers list
- Managed shipments list
- Revenue generated
- Commission earned

### 12.3 Shipment Management

**All Shipments View:**

Table:
- Shipment ID, Customer, Driver, Origin, Destination, Status, Created Date, Price, Commission
- Advanced filters: Date range, status, price range, driver, customer
- Search by ID or location
- Export to Excel

Shipment Details:
- Full shipment information
- Timeline of events
- Chat history
- Map showing route taken
- Proof of delivery
- Ratings
- Actions: Cancel, Refund, Mark as disputed

**Real-Time Monitoring:**

Live Map:
- Map showing all active shipments
- Driver markers with driver info
- Shipment routes
- Click marker to see details
- Filter by status

### 12.4 Financial Management

**Revenue Dashboard:**

Overview:
- Total revenue (all time)
- This month's revenue
- Commission earned
- Pending payouts to drivers
- Processed payouts

Transaction Log:
- All transactions table
- Filters: Type (payment, refund, payout), date, amount range, user
- Export financial reports

Payout Management:
- Pending payouts queue
- Approve/reject payout requests
- Batch payout processing
- Payout history

**Pricing Management:**

Dynamic Pricing Controls:
- Set base rates per KM
- Set multipliers for vehicle types
- Set peak hour multipliers
- Set seasonal multipliers
- Surge pricing rules

Commission Settings:
- Set platform commission percentage
- Set broker commission
- Volume discount tiers
- Promotional commission rates

### 12.5 Content Management

**Static Pages:**

Manage:
- About Us
- Terms of Service
- Privacy Policy
- FAQ
- Help Center Articles
- Blog posts (if applicable)

WYSIWYG Editor:
- Rich text editor
- Image upload
- SEO metadata
- Publish/draft status

**Notifications Management:**

Push Notification Campaigns:
- Compose notification
- Target audience: All users, customers only, drivers only, specific segment
- Schedule send time
- Preview before sending
- Track delivery and open rates

**Promotions & Offers:**

Create Promotions:
- Promo codes (e.g., "FIRSTRIDE" for 20% off)
- Discount type: Percentage or fixed amount
- Valid from/to dates
- Usage limit: Per user, total uses
- Minimum order value
- Target user segment

Active Promotions:
- List of active/scheduled/expired promotions
- Usage statistics
- Revenue impact

### 12.6 Support & Dispute Management

**Support Tickets:**

Ticket Queue:
- All support tickets
- Priority: High, Medium, Low
- Status: Open, In Progress, Resolved, Closed
- Assigned to: Support agent name
- Response time tracking

Ticket Details:
- Conversation history
- User information
- Related shipment (if applicable)
- Internal notes (not visible to user)
- Actions: Reply, Escalate, Close

**Dispute Management:**

Dispute Queue:
- All open disputes
- Type: Payment, Damage, Service quality, Other
- Severity level
- Time elapsed since opened

Dispute Resolution:
- View evidence from both parties
- Chat history
- Shipment details
- Admin notes
- Resolution actions: Refund (full/partial), Driver penalty, Close without action
- Resolution notes (communicated to both parties)

### 12.7 Analytics & Reports

**User Analytics:**

Metrics:
- User acquisition rate
- User retention rate
- Active users (DAU, WAU, MAU)
- Churn rate
- User lifetime value

Charts:
- User growth over time
- User demographics
- User engagement

**Shipment Analytics:**

Metrics:
- Total shipments
- Completion rate
- Cancellation rate
- Average shipment value
- Average distance
- Average delivery time

Charts:
- Shipments by hour of day
- Shipments by day of week
- Shipments by city
- Popular routes

**Financial Reports:**

Generate Reports:
- Revenue report (daily, weekly, monthly)
- Commission report
- Payout report
- Refund report
- Export to PDF or Excel

**Driver Performance:**

Leaderboard:
- Top drivers by trips
- Top drivers by earnings
- Top drivers by rating
- Most active drivers this month

Performance Metrics:
- Average rating per driver
- Acceptance rate
- Cancellation rate
- On-time delivery rate

### 12.8 System Settings

**General Settings:**

Platform Configuration:
- Platform name
- Logo upload
- Primary color theme
- Support email
- Support phone
- Operating hours

Email Templates:
- Customize transactional email templates
- Variables: User name, shipment ID, etc.
- Preview before saving

**Feature Toggles:**

Enable/Disable Features:
- Cash on delivery
- Bidding system
- Insurance option
- Instant matching
- Driver subscription plan
- Referral program

**API Management:**

API Keys:
- Generate API keys for integrations
- Revoke keys
- Monitor API usage

Third-Party Integrations:
- Google Maps API key
- Payment gateway credentials
- SMS provider settings
- Email service settings
- Push notification certificates

**Security Settings:**

Authentication:
- Minimum password requirements
- Two-factor authentication enforcement
- Session timeout duration
- Maximum login attempts

Data Protection:
- GDPR compliance tools
- Data export for users
- Data deletion requests
- Privacy settings

---

## 13. MOBILE APP SPECIFICATIONS

### 13.1 Onboarding Experience

**First Launch:**

Splash Screen:
- Jammal logo
- App version number
- Loading animation (max 2 seconds)

Welcome Screens (3-4 slides):
- Slide 1: "Ship Anything, Anywhere" + illustration
- Slide 2: "Track in Real-Time" + illustration
- Slide 3: "Trusted Drivers" + illustration
- Slide 4: "Get Started" button

Language Selection:
- Arabic / English toggle
- Saved in user preferences
- RTL layout for Arabic

**Registration Wizard:**

Progressive Disclosure:
- Step indicators (1 of 5, 2 of 5, etc.)
- Back button to go to previous step
- Skip option for optional steps
- Auto-save progress

### 13.2 App Navigation Structure

**Bottom Navigation Bar (for Customers):**

5 Tabs:
1. **Home:** Main dashboard, create shipment
2. **My Shipments:** Active and past shipments
3. **Track:** Live tracking of active shipment
4. **Wallet:** Payment methods, transaction history
5. **Profile:** Settings, help, account info

**Bottom Navigation (for Drivers):**

5 Tabs:
1. **Home:** Map view with requests
2. **Trips:** Active and scheduled trips
3. **Earnings:** Financial dashboard
4. **Availability:** Online/offline toggle, schedule
5. **Profile:** Settings, documents, support

**Side Menu (Hamburger Menu):**

Additional Options:
- Notifications
- Help Center
- Settings
- Invite Friends
- About
- Logout

### 13.3 Accessibility Features

**Accessibility Compliance:**

Features:
- VoiceOver / TalkBack support
- Dynamic font sizing
- High contrast mode
- Color blind friendly design
- Screen reader optimized labels
- Minimum touch target size: 44x44 points

Localization:
- Arabic (right-to-left layout)
- English
- Date/time formats per locale
- Currency: SAR (Saudi Riyal)

### 13.4 Offline Functionality

**Offline Mode:**

Capabilities:
- View cached shipment history
- View saved addresses
- View driver profile and documents
- Queue messages to send when online

Sync on Reconnect:
- Auto-sync queued data
- Conflict resolution for offline changes
- User notification of sync status

### 13.5 Performance Optimization

**App Performance:**

Load Time:
- Cold start: < 3 seconds
- Warm start: < 1 second
- Screen transitions: < 300ms

Image Optimization:
- Lazy loading for lists
- Compressed images
- Adaptive image quality based on network
- Image caching

Battery Optimization:
- Efficient GPS tracking
- Reduce GPS accuracy when idle
- Background task optimization
- Batch API calls

### 13.6 Security Features

**App Security:**

Implementation:
- SSL pinning for API calls
- Certificate pinning
- Encrypted local storage (SQLCipher or similar)
- Biometric authentication for sensitive actions
- Jailbreak/root detection
- Code obfuscation
- Secure password storage (Keychain/Keystore)

Session Management:
- Automatic logout after 30 days
- Logout on password change
- Device fingerprinting
- Suspicious activity alerts

---

## 14. WEB PLATFORM SPECIFICATIONS

### 14.1 Responsive Design

**Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

Responsive Behavior:
- Mobile-first approach
- Hamburger menu on mobile
- Full navigation on desktop
- Adaptive grid layouts
- Touch-friendly on tablets

### 14.2 Browser Compatibility

**Supported Browsers:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Progressive Enhancement:
- Core functionality works on all browsers
- Enhanced features for modern browsers
- Graceful degradation

### 14.3 Web-Specific Features

**Dashboard Layouts:**

Desktop Advantages:
- Multi-column layouts
- Drag-and-drop functionality
- Keyboard shortcuts
- Right-click context menus
- Hover states and tooltips

Data Tables:
- Sortable columns
- Filterable
- Exportable (CSV, PDF)
- Column visibility toggle
- Pagination with page size options

### 14.4 SEO Optimization

**SEO Best Practices:**

Technical SEO:
- Server-side rendering (Next.js)
- Dynamic meta tags per page
- Structured data markup (JSON-LD)
- XML sitemap
- Robots.txt
- Canonical URLs

Content:
- SEO-friendly URLs
- Header hierarchy (H1, H2, H3)
- Alt text for images
- Page titles and descriptions

### 14.5 Performance

**Web Performance:**

Optimization:
- Code splitting
- Lazy loading routes
- Image optimization (WebP with fallback)
- Minification and compression
- CDN for static assets
- Browser caching
- GZIP compression

Metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse score: > 90

---

## 15. API SPECIFICATIONS

### 15.1 API Architecture

**RESTful API Design:**

Base URL Structure:
```
https://api.jammal.sa/v1/
```

API Versioning:
- Version in URL path (/v1/, /v2/)
- Backward compatibility maintained
- Deprecation notices 6 months in advance

Authentication:
- JWT tokens in Authorization header
- Token expiration: 7 days
- Refresh token mechanism
- API keys for third-party integrations

### 15.2 Core API Endpoints

**Authentication Endpoints:**

```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /auth/verify-otp
POST /auth/resend-otp
POST /auth/forgot-password
POST /auth/reset-password
```

**User Endpoints:**

```
GET /users/profile
PUT /users/profile
PATCH /users/profile/photo
GET /users/notifications
PUT /users/notifications/settings
DELETE /users/account
```

**Shipment Endpoints:**

```
GET /shipments (list all shipments for user)
POST /shipments (create new shipment)
GET /shipments/{id}
PUT /shipments/{id}
DELETE /shipments/{id}
POST /shipments/{id}/cancel
GET /shipments/{id}/tracking
POST /shipments/{id}/rate
GET /shipments/{id}/invoice
```

**Driver Endpoints:**

```
GET /drivers/nearby?lat={lat}&lng={lng}&radius={radius}
GET /drivers/{id}/profile
POST /drivers/availability
GET /drivers/earnings
POST /drivers/payout-request
GET /drivers/trips
POST /drivers/trips/{id}/accept
POST /drivers/trips/{id}/start
POST /drivers/trips/{id}/complete
POST /drivers/trips/{id}/upload-proof
```

**Bid Endpoints:**

```
GET /shipments/{id}/bids
POST /shipments/{id}/bids (driver places bid)
PUT /bids/{id} (edit bid)
DELETE /bids/{id} (withdraw bid)
POST /bids/{id}/accept (customer accepts bid)
```

**Payment Endpoints:**

```
GET /payment/methods
POST /payment/methods (add payment method)
DELETE /payment/methods/{id}
POST /payment/authorize (hold funds)
POST /payment/capture (charge customer)
POST /payment/refund
GET /payment/transactions
```

**Location Endpoints:**

```
POST /location/update (driver sends GPS coordinates)
GET /location/tracking/{shipment_id} (customer gets driver location)
```

**Chat Endpoints:**

```
GET /chat/conversations
GET /chat/conversations/{id}/messages
POST /chat/conversations/{id}/messages
PUT /chat/messages/{id}/read
```

**Admin Endpoints:**

```
GET /admin/users
GET /admin/shipments
GET /admin/drivers/pending-verification
PUT /admin/drivers/{id}/verify
GET /admin/analytics/revenue
GET /admin/disputes
POST /admin/disputes/{id}/resolve
```

### 15.3 API Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Response data object
  },
  "message": "Operation successful",
  "timestamp": "2026-02-16T10:30:00Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "phone",
        "message": "Phone number is required"
      }
    ]
  },
  "timestamp": "2026-02-16T10:30:00Z"
}
```

**Pagination:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### 15.4 WebSocket Events

**Real-Time Events:**

Driver Location Updates:
```javascript
// Driver sends
socket.emit('location:update', {
  shipment_id: '12345',
  latitude: 24.7136,
  longitude: 46.6753,
  heading: 180,
  speed: 60
});

// Customer receives
socket.on('location:updated', (data) => {
  // Update map marker
});
```

Chat Messages:
```javascript
// Send message
socket.emit('chat:send', {
  conversation_id: '123',
  message: 'Hello',
  type: 'text'
});

// Receive message
socket.on('chat:message', (data) => {
  // Display message
});
```

Status Updates:
```javascript
// Status change event
socket.on('shipment:status_changed', {
  shipment_id: '12345',
  old_status: 'searching',
  new_status: 'driver_assigned',
  driver_info: {...}
});
```

---

## 16. DATABASE SCHEMA

### 16.1 Core Tables

**users table:**
```sql
users (
  id UUID PRIMARY KEY,
  user_type ENUM('customer', 'driver', 'broker', 'admin'),
  full_name_en VARCHAR(100),
  full_name_ar VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  phone VARCHAR(20) UNIQUE,
  phone_verified BOOLEAN DEFAULT false,
  password_hash VARCHAR(255),
  profile_photo_url VARCHAR(255),
  national_id VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female'),
  status ENUM('active', 'suspended', 'banned'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login_at TIMESTAMP
)
```

**customer_profiles table:**
```sql
customer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  company_name VARCHAR(100),
  company_cr VARCHAR(20),
  is_business BOOLEAN DEFAULT false,
  preferred_payment_method VARCHAR(50),
  total_shipments INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2),
  created_at TIMESTAMP
)
```

**driver_profiles table:**
```sql
driver_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  verification_status ENUM('pending', 'approved', 'rejected'),
  driver_license_number VARCHAR(50),
  driver_license_expiry DATE,
  driver_license_photo_url VARCHAR(255),
  national_id_photo_front VARCHAR(255),
  national_id_photo_back VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  last_location_update TIMESTAMP,
  total_trips INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  available_balance DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2),
  acceptance_rate DECIMAL(5,2),
  cancellation_rate DECIMAL(5,2),
  on_time_rate DECIMAL(5,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**vehicles table:**
```sql
vehicles (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES users(id),
  vehicle_type ENUM('pickup', 'small_lorry', 'medium_lorry', 'large_truck', 'refrigerated', 'flatbed'),
  make VARCHAR(50),
  model VARCHAR(50),
  year INT,
  license_plate VARCHAR(20) UNIQUE,
  color VARCHAR(30),
  capacity_kg DECIMAL(8,2),
  length_meters DECIMAL(5,2),
  registration_number VARCHAR(50),
  registration_expiry DATE,
  registration_photo_url VARCHAR(255),
  insurance_number VARCHAR(50),
  insurance_expiry DATE,
  insurance_photo_url VARCHAR(255),
  vehicle_photos JSON, -- Array of photo URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**broker_profiles table:**
```sql
broker_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  company_name_en VARCHAR(100),
  company_name_ar VARCHAR(100),
  commercial_registration VARCHAR(50),
  cr_photo_url VARCHAR(255),
  tax_number VARCHAR(50),
  license_number VARCHAR(50),
  verification_status ENUM('pending', 'approved', 'rejected'),
  total_shipments INT DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP
)
```

**shipments table:**
```sql
shipments (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  broker_id UUID REFERENCES users(id) NULL,
  driver_id UUID REFERENCES users(id) NULL,
  
  -- Pickup details
  pickup_address TEXT,
  pickup_latitude DECIMAL(10,8),
  pickup_longitude DECIMAL(11,8),
  pickup_contact_name VARCHAR(100),
  pickup_contact_phone VARCHAR(20),
  pickup_date DATE,
  pickup_time TIME,
  pickup_instructions TEXT,
  
  -- Delivery details
  delivery_address TEXT,
  delivery_latitude DECIMAL(10,8),
  delivery_longitude DECIMAL(11,8),
  delivery_contact_name VARCHAR(100),
  delivery_contact_phone VARCHAR(20),
  delivery_date DATE,
  delivery_time TIME,
  delivery_instructions TEXT,
  
  -- Cargo details
  cargo_type VARCHAR(100),
  cargo_description TEXT,
  cargo_weight_kg DECIMAL(8,2),
  cargo_length_cm DECIMAL(6,2),
  cargo_width_cm DECIMAL(6,2),
  cargo_height_cm DECIMAL(6,2),
  cargo_quantity INT,
  cargo_photos JSON, -- Array of photo URLs
  special_handling JSON, -- Array of special requirements
  
  -- Vehicle requirements
  required_vehicle_type VARCHAR(50),
  minimum_capacity_kg DECIMAL(8,2),
  
  -- Pricing
  pricing_type ENUM('instant_quote', 'bidding'),
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  platform_commission DECIMAL(10,2),
  insurance_fee DECIMAL(10,2),
  insurance_value DECIMAL(10,2),
  
  -- Status
  status ENUM('draft', 'searching', 'driver_assigned', 'driver_en_route_pickup', 'arrived_pickup', 'cargo_loaded', 'in_transit', 'arrived_delivery', 'delivered', 'cancelled', 'disputed'),
  
  -- Timestamps
  created_at TIMESTAMP,
  assigned_at TIMESTAMP,
  pickup_completed_at TIMESTAMP,
  delivery_completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Proof
  pickup_proof_photo_url VARCHAR(255),
  delivery_proof_photo_url VARCHAR(255),
  customer_signature TEXT, -- Base64 encoded signature
  
  distance_km DECIMAL(8,2),
  duration_minutes INT,
  
  updated_at TIMESTAMP
)
```

**bids table:**
```sql
bids (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  driver_id UUID REFERENCES users(id),
  bid_amount DECIMAL(10,2),
  message TEXT,
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn'),
  created_at TIMESTAMP,
  expires_at TIMESTAMP
)
```

**payments table:**
```sql
payments (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  user_id UUID REFERENCES users(id),
  payment_type ENUM('shipment', 'refund', 'payout', 'commission'),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'SAR',
  payment_method ENUM('card', 'mada', 'apple_pay', 'stc_pay', 'bank_transfer', 'cash', 'wallet'),
  payment_gateway VARCHAR(50),
  transaction_id VARCHAR(100),
  status ENUM('pending', 'authorized', 'captured', 'failed', 'refunded'),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
)
```

**ratings table:**
```sql
ratings (
  id UUID PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  rated_by UUID REFERENCES users(id),
  rated_user UUID REFERENCES users(id),
  overall_rating INT, -- 1-5
  punctuality_rating INT,
  professionalism_rating INT,
  vehicle_cleanliness_rating INT,
  cargo_handling_rating INT,
  review_text TEXT,
  review_photos JSON,
  tags JSON, -- Array of tags
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

**messages table:**
```sql
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  shipment_id UUID REFERENCES shipments(id) NULL,
  message_type ENUM('text', 'image', 'location'),
  message_text TEXT,
  media_url VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

**location_history table:**
```sql
location_history (
  id BIGSERIAL PRIMARY KEY,
  shipment_id UUID REFERENCES shipments(id),
  driver_id UUID REFERENCES users(id),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  heading DECIMAL(5,2),
  speed_kmh DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
-- Partitioned by date for performance
```

**notifications table:**
```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  notification_type VARCHAR(50),
  title VARCHAR(200),
  message TEXT,
  data JSON, -- Additional data like shipment_id, etc.
  is_read BOOLEAN DEFAULT false,
  sent_push BOOLEAN DEFAULT false,
  sent_sms BOOLEAN DEFAULT false,
  sent_email BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

### 16.2 Indexes

**Essential Indexes:**

```sql
CREATE INDEX idx_shipments_customer_status ON shipments(customer_id, status);
CREATE INDEX idx_shipments_driver_status ON shipments(driver_id, status);
CREATE INDEX idx_shipments_status_created ON shipments(status, created_at);
CREATE INDEX idx_drivers_online_location ON driver_profiles(is_online, current_latitude, current_longitude);
CREATE INDEX idx_location_history_shipment_time ON location_history(shipment_id, timestamp);
CREATE INDEX idx_payments_user_type ON payments(user_id, payment_type);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

## 17. THIRD-PARTY INTEGRATIONS

### 17.1 Google Maps Integration

**Required APIs:**

1. **Maps JavaScript API** (Web)
   - Display maps
   - Markers and polylines
   - Info windows

2. **Maps SDK for iOS** (Mobile)
   - Native iOS maps

3. **Maps SDK for Android** (Mobile)
   - Native Android maps

4. **Places API**
   - Address autocomplete
   - Place details
   - Geocoding

5. **Directions API**
   - Route calculation
   - Turn-by-turn directions
   - Alternative routes
   - Distance matrix

6. **Distance Matrix API**
   - Calculate distance between multiple points
   - Used for pricing

7. **Geolocation API**
   - Determine user's current location

**Implementation Notes:**

- Restrict API keys by domain/app
- Enable billing alerts
- Implement request caching to reduce costs
- Use Static Maps API for thumbnails

### 17.2 Payment Gateway Integration

**Primary Gateway: Hyperpay / Moyasar / Tap Payments**

Features Required:
- Tokenization (save cards securely)
- 3D Secure authentication
- Apple Pay integration
- Mada (Saudi debit card) support
- STC Pay integration
- Refund API
- Webhook for payment status updates

Implementation:
- Server-side payment processing
- PCI DSS compliance (use hosted payment pages or SDK)
- Payment status webhooks
- Retry logic for failed payments

### 17.3 SMS Service Integration

**Provider: Unifonic (Saudi) or Twilio**

Use Cases:
- OTP verification codes
- Shipment status notifications
- Payment confirmations
- Critical alerts

Implementation:
- SMS templates
- Delivery tracking
- Fallback to secondary provider
- Cost optimization (avoid unnecessary SMS)

### 17.4 Email Service Integration

**Provider: SendGrid or AWS SES**

Use Cases:
- Transactional emails (registration, password reset)
- Shipment confirmations
- Invoices and receipts
- Weekly summaries
- Marketing emails (with unsubscribe)

Implementation:
- HTML email templates
- Responsive design
- Tracking (opens, clicks)
- SPF/DKIM/DMARC configuration
- Bounce and complaint handling

### 17.5 Push Notification Services

**iOS: Apple Push Notification Service (APNS)**
**Android: Firebase Cloud Messaging (FCM)**

Implementation:
- Device token registration
- Topic-based messaging
- Silent notifications (for background updates)
- Rich notifications (images, actions)
- Notification badges
- Deep linking to specific screens

### 17.6 Cloud Storage Integration

**Provider: AWS S3 or Google Cloud Storage**

Use Cases:
- User profile photos
- Document uploads (licenses, registration, etc.)
- Cargo photos
- Proof of delivery photos
- Generated invoices/reports

Implementation:
- Signed URLs for secure uploads
- Image resizing (Lambda/Cloud Functions)
- CDN for fast delivery
- Lifecycle policies (delete old files)
- Access control (private vs. public files)

### 17.7 Analytics Integration

**Google Analytics / Firebase Analytics**

Track:
- User acquisition sources
- User engagement
- Screen views
- Conversion funnels
- Retention cohorts

**Custom Events:**
- Shipment created
- Bid placed
- Payment completed
- Rating submitted
- App crashes

---

## 18. SECURITY & COMPLIANCE

### 18.1 Data Security

**Encryption:**

Data at Rest:
- Database encryption (TDE - Transparent Data Encryption)
- Encrypted backups
- Encrypted file storage

Data in Transit:
- HTTPS/TLS 1.3 for all API calls
- Certificate pinning in mobile apps
- WSS (WebSocket Secure) for real-time communication

Sensitive Data:
- Password hashing: bcrypt (cost factor 12+)
- API keys: environment variables, never hardcoded
- Payment data: Never stored; use payment gateway tokens
- PII encryption: National ID, phone numbers encrypted in database

### 18.2 Authentication & Authorization

**Authentication:**

- JWT tokens with short expiration (7 days)
- Refresh tokens for extended sessions
- Biometric authentication on mobile
- Two-factor authentication (optional, recommended for high-value accounts)

**Authorization:**

- Role-based access control (RBAC)
- Permissions checked on every API request
- Separate admin privileges
- Audit logs for admin actions

### 18.3 Input Validation & Sanitization

**Server-Side Validation:**

- Validate all input data
- Whitelist allowed values
- Sanitize user input to prevent XSS
- Parameterized queries to prevent SQL injection
- Rate limiting on API endpoints

### 18.4 Privacy & Compliance

**GDPR-like Privacy:**

User Rights:
- Right to access personal data
- Right to data portability (export data)
- Right to deletion (delete account)
- Right to rectification (edit data)

Implementation:
- Privacy policy (clear, accessible)
- Cookie consent (web)
- Data retention policies
- Anonymization of deleted user data
- Audit trail of data access

**Saudi Arabia Specific:**

- Comply with Saudi Arabia's Personal Data Protection Law (PDPL)
- Data localization (if required by regulations)
- Arabic language support for legal documents

### 18.5 Fraud Prevention

**Measures:**

- Device fingerprinting
- IP-based rate limiting
- Unusual activity detection (e.g., same user creating 50 shipments in 1 hour)
- Verification holds on new accounts
- Manual review of high-value shipments
- Blacklist for known fraudulent users

---

## 19. TESTING REQUIREMENTS

### 19.1 Testing Types

**Unit Testing:**

- Backend: Jest/Mocha for Node.js, pytest for Python
- Frontend: Jest + React Testing Library
- Coverage target: > 80%

**Integration Testing:**

- API endpoint testing
- Database interaction testing
- Third-party service integration testing

**End-to-End Testing:**

- Mobile: Detox (React Native) or Maestro
- Web: Cypress or Playwright
- Critical user flows:
  - Registration and login
  - Create and complete shipment
  - Payment processing
  - Live tracking

**Performance Testing:**

- Load testing (Apache JMeter, Artillery)
- Stress testing
- Spike testing
- Simulate 10,000 concurrent users

**Security Testing:**

- Penetration testing
- Vulnerability scanning (OWASP ZAP)
- Dependency scanning (Snyk)

**Usability Testing:**

- User acceptance testing (UAT) with real users
- A/B testing for UI variations
- Accessibility testing (WCAG 2.1 compliance)

### 19.2 Test Environments

**Environments:**

1. **Development:** Local machines
2. **Staging:** Mirrors production, for testing before release
3. **Production:** Live environment

CI/CD Pipeline:
- Automated testing on every commit
- Deploy to staging after passing tests
- Manual approval for production deployment

---

## 20. MONITORING & MAINTENANCE

### 20.1 Application Monitoring

**Tools:**

- **Error Tracking:** Sentry
- **Performance Monitoring:** New Relic / DataDog / AWS CloudWatch
- **Uptime Monitoring:** Pingdom / UptimeRobot
- **Log Aggregation:** ELK Stack (Elasticsearch, Logstash, Kibana) or CloudWatch Logs

**Metrics to Monitor:**

- API response times
- Error rates
- Database query performance
- Active users (real-time)
- Payment success/failure rates
- GPS update frequency

### 20.2 Alerts

**Alert Triggers:**

- Server downtime
- Error rate spike (> 5% of requests)
- Database connection failures
- Payment gateway failures
- GPS tracking failures
- Low disk space
- High CPU/memory usage

Alert Channels:
- Email to on-call engineer
- SMS for critical alerts
- Slack/Teams integration
- PagerDuty for escalation

### 20.3 Backup & Disaster Recovery

**Database Backups:**

- Automated daily backups
- Retention: 30 days
- Point-in-time recovery capability
- Encrypted backups
- Offsite backup storage
- Regular restore testing

**Application Backups:**

- Code repository (Git) with multiple redundancies
- Infrastructure as Code (Terraform, CloudFormation)
- Configuration backups

Disaster Recovery Plan:
- RTO (Recovery Time Objective): < 4 hours
- RPO (Recovery Point Objective): < 1 hour
- Documented recovery procedures
- Regular DR drills

---


## 24. DEVELOPER HANDOFF CHECKLIST

**Before Development Begins:**

- [ ] Finalize tech stack
- [ ] Set up development environment
- [ ] Create Git repository structure
- [ ] Set up CI/CD pipeline
- [ ] Obtain API keys for all third-party services
- [ ] Set up staging and production environments
- [ ] Create design mockups (Figma/Adobe XD)
- [ ] Define API contracts
- [ ] Set up project management tool (Jira/Trello)
- [ ] Create development timeline

**Design Assets Needed:**

- [ ] Logo (multiple sizes, formats)
- [ ] Color palette
- [ ] Typography guidelines
- [ ] Icon set
- [ ] Illustrations
- [ ] App screenshots for stores
- [ ] Marketing materials

**Documentation:**

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Environment setup guide
- [ ] Code style guide
- [ ] Git workflow guidelines

---

## 25. KEY PERFORMANCE INDICATORS (KPIs)

**Metrics to Track:**

User Metrics:
- Total users (customers, drivers, brokers)
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention rate (30-day, 90-day)
- Churn rate

Shipment Metrics:
- Total shipments
- Shipments per day
- Average shipment value
- Completion rate
- Cancellation rate
- Average delivery time
- On-time delivery percentage

Financial Metrics:
- Gross Merchandise Value (GMV)
- Revenue (platform commission)
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- LTV/CAC ratio (target: > 3)
- Payment failure rate

Driver Metrics:
- Active drivers
- Average trips per driver
- Average earnings per driver
- Driver acceptance rate
- Driver retention rate

Quality Metrics:
- Average customer rating
- Average driver rating
- Support ticket volume
- Resolution time
- Net Promoter Score (NPS)

Technical Metrics:
- App crash rate (target: < 0.1%)
- API error rate (target: < 1%)
- Page load time
- Server uptime (target: 99.9%)

---

## CONCLUSION

This comprehensive technical requirements document provides a complete blueprint for developing the Jammal freight platform. It covers all aspects from user registration to complex features like real-time tracking, payments, and analytics.

