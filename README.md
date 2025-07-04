# QuickBlog

A fully functional blog platform built with Django, Django REST Framework, MySQL, JWT authentication, and a modern Vite + Tailwind CSS frontend.

Users can register, log in, and create, edit, and delete blog posts. The platform offers a REST API, responsive design, and dynamic content loading for a seamless user experience.

**Live Demo:** [http://13.200.229.145/](http://13.200.229.145/)


## 🚀 Features

- ✅ User Registration & JWT Authentication
- ✅ Create, Read, Update, Delete (CRUD) blog posts
- ✅ Rich text editing for blog content
- ✅ RESTful API with pagination
- ✅ Responsive frontend with Vite + Tailwind CSS
- ✅ Dynamic “Load More” posts using Axios
- ✅ Custom admin interface for managing users and posts
- ✅ Optional Features:
  - Comments
  - Likes
  - Search functionality
  - Category-based blogs

---

## 💻 Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** MySQL
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Frontend:** Vite, Tailwind CSS, Axios
- **Language:** Python 3.x, JavaScript (ES6+)








## Backend Setup

### 1. Clone the Repository

git clone https://github.com/nihala45/QuickBlog.git
cd QuickBlog

2. Create Python Virtual Environment
python -m venv venv
venv\Scripts\activate

3. Install Python Requirements
pip install -r requirements.txt

4. Configure MySQL Database
 Create a new MySQL Database
Log into your MySQL server and run:
CREATE DATABASE blog_db CHARACTER SET utf8mb4;

b. Update settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'blog_db',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


5. Run Database Migrations
python manage.py makemigrations
python manage.py migrate

6. Create Superuser
python manage.py createsuperuser

7.Start Django Development Server
python manage.py runserver
Server runs at:
http://127.0.0.1:8000/

Frontend Setup (Vite + Tailwind CSS)
1. Navigate to Frontend Directory
npm create vite@latest frontend
cd frontend

2. Install Node Dependencies
npm install

3. Configure Tailwind CSS
Install Tailwind CSS
npm install tailwindcss @tailwindcss/vite

Configure the Vite plugin
Add the @tailwindcss/vite plugin to your Vite configuration
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
Import Tailwind CSS
Add an @import to your CSS file that imports Tailwind CSS.
@import "tailwindcss";

4. Run Vite Development Server
http://localhost:5173/
