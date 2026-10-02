try {
      var isDemo = sessionStorage.getItem('smm_demo_mode') === 'true' || localStorage.getItem('smm_demo_mode') === 'true';
      var cachedUser = localStorage.getItem('smm_user_cached');
      if (isDemo || cachedUser) {
        document.documentElement.classList.add('smm-has-session');
      }
    } catch (e) {}