-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('customer', 'driver', 'broker', 'admin', 'support');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'banned');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('pickup', 'small_lorry', 'medium_lorry', 'large_truck', 'refrigerated', 'flatbed', 'tanker', 'car_carrier', 'crane_truck');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('draft', 'searching', 'driver_assigned', 'driver_en_route_pickup', 'arrived_pickup', 'cargo_loaded', 'in_transit', 'arrived_delivery', 'delivered', 'cancelled', 'disputed');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('instant_quote', 'bidding');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'expired');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('shipment', 'refund', 'payout', 'commission');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('card', 'mada', 'apple_pay', 'stc_pay', 'bank_transfer', 'cash', 'wallet');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'location', 'system');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('shipment_update', 'bid_received', 'bid_accepted', 'bid_rejected', 'payment_received', 'payment_failed', 'driver_assigned', 'delivery_completed', 'rating_reminder', 'document_expiry', 'system_alert', 'promotional');

-- CreateEnum
CREATE TYPE "CargoHandling" AS ENUM ('fragile', 'refrigerated', 'hazardous', 'heavy_machinery', 'oversized', 'valuable', 'perishable', 'liquid');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "user_type" "UserType" NOT NULL,
    "full_name_en" VARCHAR(100) NOT NULL,
    "full_name_ar" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(20) NOT NULL,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" VARCHAR(255) NOT NULL,
    "profile_photo_url" VARCHAR(500),
    "national_id" VARCHAR(20),
    "date_of_birth" DATE,
    "gender" "Gender",
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "locale" VARCHAR(5) NOT NULL DEFAULT 'ar',
    "fcm_token" VARCHAR(500),
    "last_login_at" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "user_id" UUID NOT NULL,
    "company_name" VARCHAR(100),
    "company_cr" VARCHAR(20),
    "is_business" BOOLEAN NOT NULL DEFAULT false,
    "preferred_payment_method" VARCHAR(50),
    "total_shipments" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "driver_profiles" (
    "user_id" UUID NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "driver_license_number" VARCHAR(50),
    "driver_license_expiry" DATE,
    "driver_license_photo_url" VARCHAR(500),
    "national_id_photo_front" VARCHAR(500),
    "national_id_photo_back" VARCHAR(500),
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "current_latitude" DECIMAL(10,8),
    "current_longitude" DECIMAL(11,8),
    "last_location_update" TIMESTAMP(3),
    "total_trips" INTEGER NOT NULL DEFAULT 0,
    "total_earnings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "available_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "acceptance_rate" DECIMAL(5,2),
    "cancellation_rate" DECIMAL(5,2),
    "on_time_rate" DECIMAL(5,2),
    "iban" VARCHAR(34),
    "service_areas" JSONB,
    "max_distance" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "broker_profiles" (
    "user_id" UUID NOT NULL,
    "company_name_en" VARCHAR(100),
    "company_name_ar" VARCHAR(100),
    "commercial_registration" VARCHAR(50),
    "cr_photo_url" VARCHAR(500),
    "tax_number" VARCHAR(50),
    "license_number" VARCHAR(50),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "total_shipments" INTEGER NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "iban" VARCHAR(34),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "broker_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "make" VARCHAR(50),
    "model" VARCHAR(50),
    "year" INTEGER,
    "license_plate" VARCHAR(20) NOT NULL,
    "color" VARCHAR(30),
    "capacity_kg" DECIMAL(8,2) NOT NULL,
    "length_meters" DECIMAL(5,2),
    "registration_number" VARCHAR(50),
    "registration_expiry" DATE,
    "registration_photo_url" VARCHAR(500),
    "insurance_number" VARCHAR(50),
    "insurance_expiry" DATE,
    "insurance_photo_url" VARCHAR(500),
    "vehicle_photos" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "broker_id" UUID,
    "driver_id" UUID,
    "pickup_address" TEXT NOT NULL,
    "pickup_latitude" DECIMAL(10,8) NOT NULL,
    "pickup_longitude" DECIMAL(11,8) NOT NULL,
    "pickup_contact_name" VARCHAR(100),
    "pickup_contact_phone" VARCHAR(20),
    "pickup_date" DATE,
    "pickup_time" TIME,
    "pickup_instructions" TEXT,
    "delivery_address" TEXT NOT NULL,
    "delivery_latitude" DECIMAL(10,8) NOT NULL,
    "delivery_longitude" DECIMAL(11,8) NOT NULL,
    "delivery_contact_name" VARCHAR(100),
    "delivery_contact_phone" VARCHAR(20),
    "delivery_date" DATE,
    "delivery_time" TIME,
    "delivery_instructions" TEXT,
    "cargo_type" VARCHAR(100),
    "cargo_description" TEXT,
    "cargo_weight_kg" DECIMAL(8,2),
    "cargo_length_cm" DECIMAL(6,2),
    "cargo_width_cm" DECIMAL(6,2),
    "cargo_height_cm" DECIMAL(6,2),
    "cargo_quantity" INTEGER,
    "cargo_photos" JSONB,
    "special_handling" JSONB,
    "required_vehicle_type" VARCHAR(50),
    "minimum_capacity_kg" DECIMAL(8,2),
    "pricing_type" "PricingType" NOT NULL,
    "estimated_price" DECIMAL(10,2),
    "final_price" DECIMAL(10,2),
    "platform_commission" DECIMAL(10,2),
    "insurance_fee" DECIMAL(10,2),
    "insurance_value" DECIMAL(10,2),
    "max_acceptable_price" DECIMAL(10,2),
    "status" "ShipmentStatus" NOT NULL DEFAULT 'draft',
    "assigned_at" TIMESTAMP(3),
    "pickup_completed_at" TIMESTAMP(3),
    "delivery_completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "bidding_expires_at" TIMESTAMP(3),
    "pickup_proof_photo_url" VARCHAR(500),
    "delivery_proof_photo_url" VARCHAR(500),
    "customer_signature" TEXT,
    "distance_km" DECIMAL(8,2),
    "duration_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "bid_amount" DECIMAL(10,2) NOT NULL,
    "message" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "shipment_id" UUID,
    "user_id" UUID NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SAR',
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_gateway" VARCHAR(50),
    "transaction_id" VARCHAR(100),
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "rated_by" UUID NOT NULL,
    "rated_user" UUID NOT NULL,
    "overall_rating" INTEGER NOT NULL,
    "punctuality_rating" INTEGER,
    "professionalism_rating" INTEGER,
    "vehicle_cleanliness_rating" INTEGER,
    "cargo_handling_rating" INTEGER,
    "review_text" TEXT,
    "review_photos" JSONB,
    "tags" JSONB,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "shipment_id" UUID,
    "message_type" "MessageType" NOT NULL DEFAULT 'text',
    "message_text" TEXT,
    "media_url" VARCHAR(500),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_history" (
    "id" BIGSERIAL NOT NULL,
    "shipment_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "heading" DECIMAL(5,2),
    "speed_kmh" DECIMAL(5,2),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "title_ar" VARCHAR(200),
    "message" TEXT NOT NULL,
    "message_ar" TEXT,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_push" BOOLEAN NOT NULL DEFAULT false,
    "sent_sms" BOOLEAN NOT NULL DEFAULT false,
    "sent_email" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "purpose" VARCHAR(30) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "device" VARCHAR(200),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "contact_name" VARCHAR(100),
    "contact_phone" VARCHAR(20),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broker_drivers" (
    "id" UUID NOT NULL,
    "broker_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "commission_split" DECIMAL(5,2) NOT NULL DEFAULT 70.00,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "assigned_routes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "broker_drivers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "idx_drivers_online_location" ON "driver_profiles"("is_online", "current_latitude", "current_longitude");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles"("license_plate");

-- CreateIndex
CREATE INDEX "idx_shipments_customer_status" ON "shipments"("customer_id", "status");

-- CreateIndex
CREATE INDEX "idx_shipments_driver_status" ON "shipments"("driver_id", "status");

-- CreateIndex
CREATE INDEX "idx_shipments_status_created" ON "shipments"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "bids_shipment_id_driver_id_key" ON "bids"("shipment_id", "driver_id");

-- CreateIndex
CREATE INDEX "idx_payments_user_type" ON "payments"("user_id", "payment_type");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_shipment_id_rated_by_key" ON "ratings"("shipment_id", "rated_by");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_location_history_shipment_time" ON "location_history"("shipment_id", "timestamp");

-- CreateIndex
CREATE INDEX "idx_notifications_user_read" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "broker_drivers_broker_id_driver_id_key" ON "broker_drivers"("broker_id", "driver_id");

-- AddForeignKey
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_profiles" ADD CONSTRAINT "driver_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_profiles" ADD CONSTRAINT "broker_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rated_by_fkey" FOREIGN KEY ("rated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rated_user_fkey" FOREIGN KEY ("rated_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_history" ADD CONSTRAINT "location_history_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_history" ADD CONSTRAINT "location_history_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_addresses" ADD CONSTRAINT "saved_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_drivers" ADD CONSTRAINT "broker_drivers_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broker_drivers" ADD CONSTRAINT "broker_drivers_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
