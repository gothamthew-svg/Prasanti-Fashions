# 💛 Pra Fashions — Your Guide to Managing the Website
### (No tech knowledge needed!)

---

## What You Can Change

You can update **everything** about any product — the price, description, photos, whether it's in stock — just by editing a spreadsheet. It works just like Excel or any other spreadsheet you've used before.

You can:
- ✅ Change prices
- ✅ Mark items out of stock
- ✅ Update descriptions
- ✅ Change or add photos
- ✅ Add brand new products
- ✅ Remove products (just delete the row)
- ✅ Mark items as "Bestseller", "New", or "Sale"

---

## Step 1 — Open Your Spreadsheet

Your spreadsheet is here:
👉 **[LINK TO YOUR GOOGLE SHEET — your son will fill this in]**

Bookmark this link on your phone and computer so you can always find it.

You need a Google account to edit it. Your son will share it with your Gmail address.

---

## Step 2 — Understand the Columns

Each **row** = one product on the website.
Each **column** = one piece of information about that product.

Here's what each column means:

| Column | What to put here | Example |
|--------|-----------------|---------|
| **A — id** | A short nickname with no spaces (your son sets this up — don't change it) | `kundan-necklace-set` |
| **B — name** | The product name as it appears on the website | `Kundan Bridal Necklace Set` |
| **C — price** | The selling price in dollars (just the number, no $ sign) | `189` |
| **D — originalPrice** | The old/crossed-out price if it's on sale. Leave empty if not on sale. | `229` |
| **E — category** | Must be one of these exactly: `Necklaces`, `Earrings`, `Bangles`, `Maang Tikka` | `Necklaces` |
| **F — material** | What it's made of | `22K Gold Plated` |
| **G — description** | The paragraph that describes the piece | `Exquisite kundan bridal...` |
| **H — details** | Bullet points about the piece. Separate each point with a \| symbol | `22K Gold Plated \| Adjustable length \| Comes in gift box` |
| **I — image1** | The web link (URL) to the product photo. See "How to add photos" below. | `https://res.cloudinary.com/...` |
| **J — image2** | A second photo link. Leave empty if you only have one photo. | |
| **K — badge** | Optional. Use one of: `Bestseller`, `New`, `Premium`, `Sale`. Leave empty for none. | `Bestseller` |
| **L — inStock** | Type `yes` if available, `no` if sold out | `yes` |
| **M — sku** | A product code (your son sets this — you don't need to change it) | `PF-NK-001` |
| **N — weight** | Approximate weight, used for shipping | `120g` |

---

## How to Change a Price

1. Open the spreadsheet
2. Find the product row (look in column B for the name)
3. Click on the cell in column C (the price)
4. Type the new price — just numbers, no $ sign
5. Press Enter
6. Save by pressing **Ctrl+S** (or it saves automatically in Google Sheets)
7. **Click the "Update Website" button** (see Step 3)

---

## How to Mark Something Out of Stock

1. Find the product row
2. Click the cell in column L (inStock)
3. Change it to `no`
4. Click the "Update Website" button

The "Add to Cart" button will automatically change to "Out of Stock" on the website.

---

## How to Add Photos

Photos need to be uploaded online first so the website can show them. Here's the easiest way:

### Option A — Google Drive (easiest)
1. Go to **drive.google.com** and upload your photo
2. Right-click the photo → click **"Share"**
3. Change access to **"Anyone with the link"**
4. Copy the link. It will look like: `https://drive.google.com/file/d/XXXXX/view`
5. Change the link to: `https://drive.google.com/uc?id=XXXXX` (replace XXXXX with the ID from the link)
6. Paste that into column I of your spreadsheet

### Option B — Cloudinary (better quality, your son can set this up)
1. Go to **cloudinary.com** and log in (your son will set up the account)
2. Click **"Upload"** and choose your photo
3. Once uploaded, click the photo and copy the URL
4. Paste it into column I

**Photo tips:**
- Use a white or cream background for the best look
- Good lighting makes a huge difference — natural light near a window works great
- Square photos work best (same width and height)

---

## How to Add a New Product

1. Go to the last row with content in the spreadsheet
2. Click the empty row below it
3. Fill in all the columns A through N (use an existing product as a guide)
4. **Important:** For column A (id), use a short nickname with only letters, numbers, and hyphens — no spaces. Example: `silver-jhumka-earrings`
5. Click the "Update Website" button

---

## How to Remove a Product

1. Find the product row
2. Right-click on the row number on the left
3. Click **"Delete row"**
4. Click the "Update Website" button

---

## Step 3 — How to Update the Website

After making any change in the spreadsheet, you need to tell the website to refresh. This takes about 1–2 minutes.

### Your "Update Website" button:

👉 **[YOUR UPDATE LINK — your son will fill this in]**
(Example: `https://prafashions.com/api/redeploy?key=sunshine123`)

**Bookmark this link too!**

When you click it, you'll see a page that says *"Website is updating!"* — that means it worked. Wait 1–2 minutes, then refresh the website to see your changes.

---

## Common Questions

**Q: I made a mistake in the spreadsheet. What do I do?**
Just fix it and click the Update Website button again. You can always undo changes in Google Sheets with Ctrl+Z.

**Q: The website doesn't show my changes after 2 minutes.**
Try refreshing the website page by pressing Ctrl+Shift+R (or Cmd+Shift+R on Mac). If it still doesn't work, message your son.

**Q: Can I accidentally break the website?**
No! The spreadsheet is completely separate from the website. The worst that can happen is a product shows incorrect information until you fix it.

**Q: How do I add a sale price?**
Put the original (higher) price in column D and the sale price in column C. Put `Sale` in column K. The website will automatically show a strikethrough on the old price.

**Q: Someone ordered something that's out of stock. What do I do?**
Mark it `no` in column L immediately, then click Update Website. Contact the customer through your Stripe dashboard to arrange a refund or exchange.

---

## Need Help?

Call or message your son — he can fix almost anything remotely without needing to be there in person. 💛
