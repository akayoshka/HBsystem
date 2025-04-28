<!-- src/components/layout/FooterComponent.vue -->
<template>
    <footer>
      <div class="footer">
        <div class="footer-links">
          <h3>Links</h3>
          <ul>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/doctors">Doctors</router-link>
            </li>
            <li>
              <router-link to="/appointments">Appointments</router-link>
            </li>
            <li>
              <router-link to="/notifications">Notifications</router-link>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
              <router-link to="/profile">Profile</router-link>
            </li>
          </ul>
        </div>
        <div class="social">
          <h3>Social links</h3>
          <ul>
            <li class="facebook">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                <font-awesome-icon :icon="['fab', 'facebook-f']" />
              </a>
            </li>
            <li class="youtube">
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                <font-awesome-icon :icon="['fab', 'youtube']" />
              </a>
            </li>
            <li class="instagram">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                <font-awesome-icon :icon="['fab', 'instagram']" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        Made by
        <a
          href="https://github.com/akayoshka"
          target="_blank"
          rel="noreferrer"
        >
          Son Evgeniy
        </a>
        © {{ new Date().getFullYear() }}
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterComponent'
  }
  </script>
  
  <style scoped>
  footer {
    background-color: var(--light-text-color);
  }
  
  .footer {
    display: flex;
    width: 50%;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    margin: auto;
    padding: 2rem 0;
  }
  
  .footer h3 {
    color: var(--light-blue);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .footer a {
    color: var(--light-blue);
  }
  
  .footer-links ul {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .social ul {
    display: flex;
    gap: 1rem;
  }
  
  .social li {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .social a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .social svg {
    font-size: 1.3rem;
  }
  
  .facebook {
    background-color: #3b5998;
  }
  
  .instagram {
    background: linear-gradient(
      180deg,
      rgba(64, 93, 230, 1) 0%,
      rgba(131, 58, 180, 1) 25%,
      rgba(225, 48, 108, 1) 50%,
      rgba(245, 96, 64, 1) 75%,
      rgba(252, 175, 69, 1) 100%
    );
  }
  
  .youtube {
    background-color: #ff0000;
  }
  
  .footer-bottom {
    text-align: center;
    background-color: var(--bold-text-color);
    color: var(--light-blue);
    padding: 0.3rem 0;
  }
  
  .footer-bottom a {
    color: var(--dark-blue);
  }
  
  @media screen and (max-width: 550px) {
    .social ul {
      flex-direction: column;
      align-items: center;
    }
  }
  </style>