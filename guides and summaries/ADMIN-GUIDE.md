# How to Access Admin Product Management

## Quick Steps

1. **Open the application**: http://localhost:3000

2. **Login as Admin**:
   - Username: `admin`
   - Password: `admin123`

3. **Navigate to Admin Products**:
   - Look at the top navigation bar
   - Click on **"Manage Products"** link (only visible to admin users)
   - This will take you to: http://localhost:3000/admin/products

4. **You should now see**:
   - A form at the top to create/edit products
   - A table below showing all products with **Edit** and **Delete** buttons

## What You'll See

### Create/Edit Form (Top Section)
- Fields: Product Name, Description, Price, Stock Quantity
- Button: "Create Product" or "Update Product" (when editing)
- Cancel button (when editing)

### Products Table (Bottom Section)
Columns:
- ID
- Name
- Description
- Price
- Stock
- **Actions** (Edit and Delete buttons)

## Actions Available

### ✏️ Edit a Product
1. Click the green **"Edit"** button on any product row
2. The form will populate with that product's data
3. Modify the fields as needed
4. Click **"Update Product"**
5. ✓ Success message appears
6. Table refreshes with updated data

### 🗑️ Delete a Product
1. Click the red **"Delete"** button on any product row
2. Confirm the deletion in the popup dialog
3. ✓ Success message appears
4. Product disappears from the table

### ➕ Create a Product
1. Fill in the form at the top
2. Click **"Create Product"**
3. ✓ Success message appears
4. New product appears in the table

## Troubleshooting

### "I don't see the Manage Products link"
- Make sure you're logged in as `admin` (not `client`)
- The link only appears for users with ADMIN role
- Try logging out and logging back in

### "I see the form but no table"
- The page might still be loading
- Check browser console (F12) for errors
- Make sure the API gateway is running: `docker-compose ps api-gateway`

### "I get Access Denied"
- You're logged in as a CLIENT user
- Logout and login as `admin`

### "Changes don't appear"
- Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache

## Direct URL

If you're already logged in as admin, you can go directly to:
**http://localhost:3000/admin/products**

---

**Note**: The regular Products page (http://localhost:3000/) is read-only and shows products to all users. Only the Admin Products page has edit/delete functionality.
