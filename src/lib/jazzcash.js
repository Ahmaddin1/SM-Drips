import crypto from "crypto";

function formatJazzCashDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function normalizeParamValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function generateHash(params) {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT ?? "";
  const sortedKeys = Object.keys(params).sort();
  const sortedValues = sortedKeys.map((key) => normalizeParamValue(params[key]));
  const hashInput = [integritySalt, ...sortedValues].join("&");

  return crypto
    .createHmac("sha256", integritySalt)
    .update(hashInput, "utf8")
    .digest("hex");
}

export function buildJazzCashPayload(orderData) {
  const amount = Number(orderData.amount);

  if (!Number.isFinite(amount)) {
    throw new TypeError("JazzCash amount must be a valid number.");
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + 60 * 60 * 1000);

  const payload = {
    pp_Amount: String(Math.round(amount * 100)),
    pp_BillReference: orderData.billReference,
    pp_Description: orderData.description,
    pp_Language: "EN",
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID ?? "",
    pp_Password: process.env.JAZZCASH_PASSWORD ?? "",
    pp_ReturnURL: orderData.returnURL || process.env.JAZZCASH_RETURN_URL || "",
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: formatJazzCashDate(now),
    pp_TxnExpiryDateTime: formatJazzCashDate(expiry),
    pp_TxnRefNo: orderData.txnRefNo,
    pp_TxnType: "MWALLET",
    pp_Version: "1.1",
  };

  return {
    ...payload,
    pp_SecureHash: generateHash(payload),
  };
}

export function verifyJazzCashResponse(responseParams) {
  const { pp_SecureHash: receivedHash, ...paramsWithoutHash } = responseParams;

  if (!receivedHash) {
    return false;
  }

  const generatedHash = generateHash(paramsWithoutHash);

  return generatedHash === String(receivedHash).toLowerCase();
}

export function getJazzCashEndpoint() {
  if (process.env.JAZZCASH_ENV === "production") {
    return "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";
  }

  return "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";
}
