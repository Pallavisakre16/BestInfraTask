import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../components/animated-ripple-rings';
import { DashboardMenuScreen } from '../components/dashboard/dashboard-menu-screen';
import { DashboardNotificationsScreen } from '../components/dashboard/dashboard-notifications-screen';
import { DashboardProfileScreen } from '../components/dashboard/dashboard-profile-screen';
import { DashboardScreen } from '../components/dashboard/dashboard-screen';
import { DashboardSettingsScreen } from '../components/dashboard/dashboard-settings-screen';
import { clearAuthFeedback, loginUser, logout, registerUser, setAuthenticatedUser } from '../store/slices/authSlice';
import { clearDashboard, fetchDashboardData, setDashboardData, syncDashboardIdentity } from '../store/slices/dashboardSlice';
import { clearNotifications, fetchNotifications } from '../store/slices/notificationsSlice';
import { fetchOnboarding } from '../store/slices/onboardingSlice';
import { clearProfile, fetchProfile, setProfileData, updateProfile } from '../store/slices/profileSlice';
import { clearSettings, fetchSettings, updateSettings } from '../store/slices/settingsSlice';

const REFERENCE_WIDTH = 375;
const REFERENCE_HEIGHT = 812;
const BASE_RIPPLE_SIZES = [84, 116, 148, 180, 212, 244, 276, 308, 340];
const DASHBOARD_MENU_SCALE = 0.68;
const DASHBOARD_MENU_TRANSLATE_X = 258;
const DASHBOARD_MENU_TRANSLATE_Y = 136;
const DASHBOARD_BACKPLATE_WIDTH = 278;
const DASHBOARD_BACKPLATE_HEIGHT = 620;
const DASHBOARD_BACKPLATE_TOP = 218;
const DASHBOARD_BACKPLATE_RIGHT = -112;
const DASHBOARD_BACKPLATE_DARK_SECTION_HEIGHT = 148;
const DEV_SCREEN_HISTORY_KEY = '__bestinfraDevScreenHistory';
const DEV_ONBOARDING_INDEX_KEY = '__bestinfraDevOnboardingIndex';

const LOGIN_FIELDS = [
  { id: 'emailOrPhone', placeholder: 'Email / Phone Number', icon: 'person-outline' },
  { id: 'password', placeholder: 'Password', icon: 'visibility-off' },
];

const REGISTER_FIELDS = [
  { id: 'name', placeholder: 'Full Name', icon: 'person-outline' },
  { id: 'email', placeholder: 'Email Id', icon: 'mail-outline' },
  { id: 'password', placeholder: 'Password', icon: 'visibility-off' },
  { id: 'confirmPassword', placeholder: 'Confirm Password', icon: 'visibility-off' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10,15}$/;

function CenterGraphic({ frameSize, ringSizes, logoWidth, logoHeight }) {
  return (
    <AnimatedRippleRings
      color="rgba(108, 135, 214, 0.18)"
      sizes={ringSizes}
      style={[styles.centerGraphicWrap, { width: frameSize, height: frameSize }]}>
      <Image source={require('../assets/images/Logo.png')} style={{ width: logoWidth, height: logoHeight }} contentFit="contain" />
    </AnimatedRippleRings>
  );
}

function AuthField({ placeholder, icon, fieldHeight, onChangeText, value, isPassword, visible, onToggleVisibility }) {
  return (
    <View style={[styles.authField, { height: 52 }]}>
      <TextInput
        style={styles.authInput}
        placeholder={placeholder}
        placeholderTextColor="#9B9B9B"
        secureTextEntry={isPassword && !visible}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={placeholder.toLowerCase().includes('name') ? 'words' : 'none'}
      />
      {isPassword ? (
        <TouchableOpacity activeOpacity={0.8} onPress={onToggleVisibility} style={styles.authFieldIconButton}>
          <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={28} color="#8D8D8D" />
        </TouchableOpacity>
      ) : (
        <MaterialIcons name={icon} size={30} color="#8D8D8D" />
      )}
    </View>
  );
}

function AuthScreen({
  mode,
  sidePadding,
  verticalScale,
  widthScale,
  insets,
  onOpenRegister,
  onOpenLogin,
  onSubmit,
  onBack,
  formValues,
  onChangeField,
  onChangeRemember,
  rememberMe,
  loading,
  errorMessage,
  statusMessage,
  validationMessage,
}) {
  const isLogin = mode === 'login';
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const headerHeight = Math.round(182 * verticalScale);
  const badgeSize = Math.round(118 * widthScale);
  const badgeLogoWidth = Math.round(60 * widthScale);
  const badgeLogoHeight = Math.round(55 * widthScale);
  const contentTopPadding = Math.round(headerHeight + badgeSize / 2 + 18 * verticalScale);
  const descriptionTopSpacing = Math.round(10 * verticalScale);
  const fieldTopSpacing = Math.round(24 * verticalScale);
  const fieldGap = Math.round(14 * verticalScale);
  const fieldHeight = Math.round(34 * verticalScale);
  const actionRowTopSpacing = Math.round(16 * verticalScale);
  const buttonTopSpacing = Math.round(18 * verticalScale);
  const registerPromptTopSpacing = Math.round(14 * verticalScale);
  const homeIndicatorBottom = insets.bottom + Math.round(8 * verticalScale);

  const title = isLogin ? 'Welcome\nto Best Infra' : 'Create Account';
  const description = isLogin
    ? 'Log in to manage installations, view\nreal-time project updates, and access smart\nmetering insights - all in one platform.'
    : null;
  const fields = isLogin ? LOGIN_FIELDS : REGISTER_FIELDS;

  return (
    <View style={styles.authScreen}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Image
        source={require('../assets/images/Rectangle.png')}
        style={[styles.authHeaderBackground, { height: headerHeight }]}
        contentFit="cover"
        contentPosition="center"
      />

      <View
        pointerEvents="none"
        style={[
          styles.authLogoBadgeWrap,
          {
            width: badgeSize,
            height: badgeSize,
            top: headerHeight - badgeSize / 2,
            marginLeft: -badgeSize / 2,
          },
        ]}>
        <Image
          source={require('../assets/images/Ellipse 1.png')}
          style={styles.authLogoBadgeBackground}
          contentFit="contain"
        />
        <View style={styles.authLogoBadgeMarkWrap}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={[styles.authLogoBadgeMark, { width: badgeLogoWidth, height: badgeLogoHeight }]}
            contentFit="contain"
          />
        </View>
      </View>

      <View style={[styles.authBody, { paddingTop: contentTopPadding, paddingHorizontal: sidePadding }]}>
        <Text style={styles.authTitle}>{title}</Text>

        {description ? <Text style={[styles.authDescription, { marginTop: descriptionTopSpacing }]}>{description}</Text> : null}

        <View style={{ width: '100%', marginTop: fieldTopSpacing, rowGap: fieldGap }}>
          {fields.map((field) => (
            <AuthField
              key={field.id}
              placeholder={field.placeholder}
              icon={field.icon}
              fieldHeight={fieldHeight}
              value={formValues[field.id] || ''}
              onChangeText={(value) => onChangeField(field.id, value)}
              isPassword={field.id.toLowerCase().includes('password')}
              visible={Boolean(passwordVisibility[field.id])}
              onToggleVisibility={() =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  [field.id]: !prev[field.id],
                }))
              }
              
            />
          ))}
        </View>

        <View style={[styles.authActionRow, { marginTop: actionRowTopSpacing }]}>
          <TouchableOpacity
            style={styles.rememberWrap}
            activeOpacity={0.7}
            onPress={() => {
              onChangeRemember?.(!rememberMe);
            }}>
            <MaterialIcons
              name={rememberMe ? 'check-box' : 'check-box-outline-blank'}
              size={18}
              color="#59B86E"
            />
            <Text style={styles.rememberText}>Remember</Text>
          </TouchableOpacity>

          <Text style={styles.forgotText}>Forgot Password?</Text>
        </View>

        <TouchableOpacity
          style={[styles.authPrimaryButton, { marginTop: buttonTopSpacing }]}
          activeOpacity={0.9}
          onPress={onSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#F4FFF8" />
          ) : (
            <Text style={styles.authPrimaryButtonText}>{isLogin ? 'Login Now' : 'Register Now'}</Text>
          )}
        </TouchableOpacity>

        {validationMessage ? <Text style={styles.authErrorText}>{validationMessage}</Text> : null}
        {errorMessage ? <Text style={styles.authErrorText}>{errorMessage}</Text> : null}
        {statusMessage ? <Text style={styles.authStatusText}>{statusMessage}</Text> : null}

        {isLogin ? (
          <View style={[styles.authRegisterPrompt, { marginTop: registerPromptTopSpacing }]}>
            <Text style={styles.authPromptText}>Don&apos;t have an account?</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={onOpenRegister}>
              <Text style={styles.authPromptLink}>Register</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.authRegisterPrompt, { marginTop: registerPromptTopSpacing }]}>
            <Text style={styles.authPromptText}>If already registered</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={onOpenLogin}>
              <Text style={styles.authPromptLink}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.homeIndicator, { bottom: homeIndicatorBottom }]} />
    </View>
  );
}

export default function SplashScreen() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const dashboardState = useSelector((state) => state.dashboard);
  const notificationsState = useSelector((state) => state.notifications);
  const onboardingState = useSelector((state) => state.onboarding);
  const profileState = useSelector((state) => state.profile);
  const settingsState = useSelector((state) => state.settings);
  const [screenHistory, setScreenHistory] = useState(() => {
    if (__DEV__) {
      const cachedHistory = globalThis[DEV_SCREEN_HISTORY_KEY];
      if (Array.isArray(cachedHistory) && cachedHistory.length > 0) {
        return cachedHistory;
      }
    }

    return [authState.token ? 'dashboard' : 'splash'];
  });
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (__DEV__) {
      const cachedIndex = globalThis[DEV_ONBOARDING_INDEX_KEY];
      if (Number.isInteger(cachedIndex) && cachedIndex >= 0) {
        return cachedIndex;
      }
    }

    return 0;
  });
  const [loginForm, setLoginForm] = useState({ emailOrPhone: '', password: '', rememberMe: false });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
  const [loginValidationError, setLoginValidationError] = useState('');
  const [registerValidationError, setRegisterValidationError] = useState('');
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef(null);
  const dashboardMenuProgress = useRef(new Animated.Value(screenHistory[screenHistory.length - 1] === 'dashboardMenu' ? 1 : 0)).current;
  const arrowFloat = useRef(new Animated.Value(8)).current;

  const screen = screenHistory[screenHistory.length - 1];
  const screenWidth = width || REFERENCE_WIDTH;
  const screenHeight = height || REFERENCE_HEIGHT;
  const slides = onboardingState.slides;
  const dashboardTheme = settingsState.data?.themeMode || 'light';
  const widthScale = screenWidth / REFERENCE_WIDTH;
  const heightScale = screenHeight / REFERENCE_HEIGHT;
  const verticalScale = Math.min(Math.max(heightScale, 0.92), 1.08);

  const sidePadding = Math.round(27 * widthScale);
  const ringSizes = BASE_RIPPLE_SIZES.map((size) => Math.round(size * widthScale));
  const rippleFrameSize = ringSizes[ringSizes.length - 1];
  const logoWidth = Math.round(78 * widthScale);
  const logoHeight = Math.round(72 * widthScale);

  const graphicTopOffset = Math.round(-54 * verticalScale);
  const graphicSlotHeight = Math.round(rippleFrameSize + Math.min(graphicTopOffset, 0) + 6 * verticalScale);
  const titleTopSpacing = Math.round(10 * verticalScale);
  const descriptionTopSpacing = Math.round(12 * verticalScale);
  const indicatorsTopSpacing = Math.round(16 * verticalScale);
  const nextButtonTopSpacing = Math.round(22 * verticalScale);
  const dockBottom = insets.bottom + Math.round(6 * verticalScale);
  const arrowGap = Math.round(18 * verticalScale);
  const bottomDockHeight = Math.round(132 * verticalScale);
  const nextToDockGap = Math.round(34 * verticalScale);
  const slideMinHeight = screenHeight - insets.top - insets.bottom;

  const isOnboarding = screen === 'onboarding';
  const isDashboardFlow = screen === 'dashboard' || screen === 'dashboardMenu';

  const navigateTo = (nextScreen, options = {}) => {
    setScreenHistory((prev) => {
      if (options.replace) {
        if (prev[prev.length - 1] === nextScreen) {
          return prev;
        }

        return [...prev.slice(0, -1), nextScreen];
      }

      if (prev[prev.length - 1] === nextScreen) {
        return prev;
      }

      return [...prev, nextScreen];
    });
  };

  const goBack = () => {
    setScreenHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  useEffect(() => {
    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowFloat, {
          toValue: -8,
          duration: 760,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(arrowFloat, {
          toValue: 8,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(220),
      ])
    );

    arrowLoop.start();

    return () => {
      arrowLoop.stop();
    };
  }, [arrowFloat]);

  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    globalThis[DEV_SCREEN_HISTORY_KEY] = screenHistory;
  }, [screenHistory]);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    globalThis[DEV_ONBOARDING_INDEX_KEY] = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (authState.token) {
      return undefined;
    }

    const splashTimer = setTimeout(() => {
      setScreenHistory((prev) => [...prev.slice(0, -1), 'onboarding']);
    }, 2800);

    return () => clearTimeout(splashTimer);
  }, [authState.token]);

  useEffect(() => {
    if (authState.token && !screen.startsWith('dashboard')) {
      setScreenHistory(['dashboard']);
    }
  }, [authState.token, screen]);

  useEffect(() => {
    if (!isOnboarding || screenWidth === 0 || slides.length <= 1) {
      return undefined;
    }

    const autoScroll = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToOffset({ offset: next * screenWidth, animated: true });
        return next;
      });
    }, 2800);

    return () => clearInterval(autoScroll);
  }, [isOnboarding, screenWidth, slides.length]);

  useEffect(() => {
    if (slides.length && currentIndex >= slides.length) {
      setCurrentIndex(0);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    dispatch(clearAuthFeedback());
    setLoginValidationError('');
    setRegisterValidationError('');
  }, [dispatch, screen]);

  useEffect(() => {
    if (!authState.token || !screen.startsWith('dashboard')) {
      return;
    }

    if (!dashboardState.data && !dashboardState.loading) {
      dispatch(fetchDashboardData());
    }

    if (!profileState.data && !profileState.loading) {
      dispatch(fetchProfile());
    }

    if (!settingsState.data && !settingsState.loading) {
      dispatch(fetchSettings());
    }

    dispatch(fetchNotifications());
  }, [
    authState.token,
    dashboardState.data,
    dashboardState.loading,
    dispatch,
    profileState.data,
    profileState.loading,
    screen,
    settingsState.data,
    settingsState.loading,
  ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'onboarding' && currentIndex > 0) {
        const previous = currentIndex - 1;
        listRef.current?.scrollToOffset({ offset: previous * screenWidth, animated: true });
        setCurrentIndex(previous);
        return true;
      }

      if (screenHistory.length > 1) {
        setScreenHistory((prev) => prev.slice(0, -1));
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [currentIndex, screen, screenHistory.length, screenWidth]);

  useEffect(() => {
    if (!isDashboardFlow) {
      dashboardMenuProgress.setValue(0);
      return;
    }

    Animated.spring(dashboardMenuProgress, {
      toValue: screen === 'dashboardMenu' ? 1 : 0,
      damping: screen === 'dashboardMenu' ? 24 : 26,
      stiffness: screen === 'dashboardMenu' ? 210 : 240,
      mass: 0.9,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      useNativeDriver: true,
    }).start();
  }, [dashboardMenuProgress, isDashboardFlow, screen]);

  const openLogin = () => {
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === 'login') {
        return prev;
      }

      if (prev[prev.length - 2] === 'login') {
        return prev.slice(0, -1);
      }

      return [...prev, 'login'];
    });
  };

  const openRegister = () => {
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === 'register') {
        return prev;
      }

      if (prev[prev.length - 2] === 'register') {
        return prev.slice(0, -1);
      }

      return [...prev, 'register'];
    });
  };

  const openDashboard = () => {
    setScreenHistory((prev) => {
      const current = prev[prev.length - 1];

      if (current === 'dashboard') {
        return prev;
      }

      if (current === 'dashboardMenu') {
        return prev.slice(0, -1);
      }

      return [...prev, 'dashboard'];
    });
  };
  const closeDashboardMenu = () => goBack();
  const openDashboardMenu = () => navigateTo('dashboardMenu');
  const openDashboardNotifications = () => navigateTo('dashboardNotifications');
  const openDashboardProfile = () => navigateTo('dashboardProfile');
  const openDashboardSettings = () => navigateTo('dashboardSettings');
  const toggleDashboardTheme = () => {
    const nextTheme = dashboardTheme === 'dark' ? 'light' : 'dark';
    dispatch(updateSettings({ themeMode: nextTheme }));
  };
  const resetSession = () => {
    dispatch(logout());
    dispatch(clearDashboard());
    dispatch(clearProfile());
    dispatch(clearNotifications());
    dispatch(clearSettings());
    setScreenHistory(['login']);
  };

  const handleLoginSubmit = async () => {
    const identity = loginForm.emailOrPhone.trim();
    const password = loginForm.password;

    if (!identity) {
      setLoginValidationError('Enter your email or phone number');
      return;
    }

    if (identity.includes('@') && !EMAIL_REGEX.test(identity)) {
      setLoginValidationError('Enter a valid email address');
      return;
    }

    if (!identity.includes('@') && !PHONE_REGEX.test(identity)) {
      setLoginValidationError('Enter a valid phone number');
      return;
    }

    if (!password) {
      setLoginValidationError('Enter your password');
      return;
    }

    setLoginValidationError('');
    const result = await dispatch(loginUser(loginForm));

    if (loginUser.fulfilled.match(result)) {
      if (result.payload.dashboard) {
        dispatch(
          setDashboardData({
            overview: result.payload.dashboard.overview,
            energySummary: result.payload.dashboard.energySummary,
            metricSummary: result.payload.dashboard.metricSummary,
            alerts: result.payload.dashboard.alerts,
            navItems: result.payload.dashboard.navItems,
            menu: result.payload.dashboard.menu,
          })
        );
      }

      dispatch(setProfileData(result.payload.user));
      dispatch(fetchDashboardData());
      dispatch(fetchProfile());
      dispatch(fetchSettings());
      dispatch(fetchNotifications());
      openDashboard();
    }
  };

  const handleRegisterSubmit = async () => {
    const trimmedName = registerForm.name.trim();
    const trimmedEmail = registerForm.email.trim().toLowerCase();

    if (!trimmedName) {
      setRegisterValidationError('Enter your full name');
      return;
    }

    if (trimmedName.length < 3) {
      setRegisterValidationError('Name must be at least 3 characters');
      return;
    }

    if (!trimmedEmail) {
      setRegisterValidationError('Enter your email address');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setRegisterValidationError('Enter a valid email address');
      return;
    }

    if (!registerForm.password) {
      setRegisterValidationError('Enter a password');
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterValidationError('Password must be at least 6 characters');
      return;
    }

    if (!registerForm.confirmPassword) {
      setRegisterValidationError('Confirm your password');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterValidationError('Passwords do not match');
      return;
    }

    setRegisterValidationError('');
    const result = await dispatch(
      registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password: registerForm.password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      setLoginForm({
        emailOrPhone: trimmedEmail,
        password: registerForm.password,
      });
      openLogin();
    }
  };

  const handleProfileSave = async (formValues) => {
    const name = formValues.name.trim();
    const email = formValues.email.trim().toLowerCase();
    const phone = formValues.phone.trim();
    const address = formValues.address.trim();

    if (!name) {
      return { ok: false, message: 'Enter your name' };
    }

    if (!email) {
      return { ok: false, message: 'Enter your email address' };
    }

    if (!EMAIL_REGEX.test(email)) {
      return { ok: false, message: 'Enter a valid email address' };
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return { ok: false, message: 'Enter a valid phone number' };
    }

    const result = await dispatch(
      updateProfile({
        name,
        email,
        phone,
        address,
      })
    );

    if (!updateProfile.fulfilled.match(result)) {
      return { ok: false, message: result.payload || 'Profile update failed' };
    }

    dispatch(setProfileData(result.payload));
    dispatch(setAuthenticatedUser(result.payload));
    dispatch(
      syncDashboardIdentity({
        name: result.payload.name,
        customerId: result.payload.customerId,
      })
    );

    return { ok: true };
  };

  const goToNext = () => {
    if (!slides.length) {
      return;
    }

    if (currentIndex === slides.length - 1) {
      openLogin();
      return;
    }

    const next = currentIndex + 1;
    listRef.current?.scrollToOffset({ offset: next * screenWidth, animated: true });
    setCurrentIndex(next);
  };

  if (isDashboardFlow) {
    const menuTranslateX = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-28, 0],
    });
    const menuOpacity = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const dashboardTranslateX = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.round(DASHBOARD_MENU_TRANSLATE_X * widthScale)],
    });
    const dashboardTranslateY = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.round(DASHBOARD_MENU_TRANSLATE_Y * verticalScale)],
    });
    const dashboardScale = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, DASHBOARD_MENU_SCALE],
    });
    const backgroundCardTranslateX = dashboardMenuProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [42, 0],
    });
    return (
      <View style={styles.dashboardDrawerShell}>
        <Animated.View
          pointerEvents={screen === 'dashboardMenu' ? 'auto' : 'none'}
          style={[
            styles.dashboardDrawerMenuLayer,
            {
              opacity: menuOpacity,
              transform: [{ translateX: menuTranslateX }],
            },
          ]}>
          <DashboardMenuScreen
            insets={insets}
            sidePadding={sidePadding}
            onClose={closeDashboardMenu}
            onOpenDashboard={closeDashboardMenu}
            onOpenNotifications={openDashboardNotifications}
            onOpenSettings={openDashboardSettings}
            onOpenProfile={openDashboardProfile}
            onLogout={resetSession}
            themeMode={dashboardTheme}
            menuData={dashboardState.data?.menu}
            profileData={profileState.data}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.dashboardDrawerBackdropCard,
            {
              width: Math.round(DASHBOARD_BACKPLATE_WIDTH * widthScale),
              height: Math.round(DASHBOARD_BACKPLATE_HEIGHT * verticalScale),
              top: Math.round(DASHBOARD_BACKPLATE_TOP * verticalScale),
              right: Math.round(DASHBOARD_BACKPLATE_RIGHT * widthScale),
              opacity: menuOpacity,
              transform: [{ translateX: backgroundCardTranslateX }],
            },
          ]}>
          <View
            style={[
              styles.dashboardDrawerBackdropTopSection,
              { height: Math.round(DASHBOARD_BACKPLATE_DARK_SECTION_HEIGHT * verticalScale) },
            ]}
          />
          <View style={styles.dashboardDrawerBackdropBottomSection} />
        </Animated.View>

        <Animated.View
          pointerEvents={screen === 'dashboardMenu' ? 'none' : 'auto'}
          style={[
            styles.dashboardDrawerDashboardLayer,
            screen === 'dashboardMenu' && styles.dashboardDrawerDashboardLayerOpen,
            {
              transform: [{ scale: dashboardScale }, { translateX: dashboardTranslateX }, { translateY: dashboardTranslateY }],
            },
          ]}>
          <DashboardScreen
            insets={insets}
            sidePadding={sidePadding}
            onOpenMenu={openDashboardMenu}
            onOpenNotifications={openDashboardNotifications}
            themeMode={dashboardTheme}
            dashboardData={dashboardState.data}
            loading={dashboardState.loading}
            hideBottomNav={screen === 'dashboardMenu'}
          />
        </Animated.View>
      </View>
    );
  }

  if (screen === 'dashboardNotifications') {
    return (
      <DashboardNotificationsScreen
        insets={insets}
        sidePadding={sidePadding}
        themeMode={dashboardTheme}
        onBack={goBack}
        items={notificationsState.items}
        loading={notificationsState.loading}
      />
    );
  }

  if (screen === 'dashboardSettings') {
    return (
      <DashboardSettingsScreen
        insets={insets}
        sidePadding={sidePadding}
        themeMode={dashboardTheme}
        onBack={goBack}
        settingsData={settingsState.data}
        loading={settingsState.loading}
        updating={settingsState.updating}
        error={settingsState.error}
        onToggleTheme={toggleDashboardTheme}
      />
    );
  }

  if (screen === 'dashboardProfile') {
    return (
      <DashboardProfileScreen
        insets={insets}
        sidePadding={sidePadding}
        themeMode={dashboardTheme}
        onBack={goBack}
        onLogout={resetSession}
        profileData={profileState.data}
        dashboardData={dashboardState.data}
        saving={profileState.updating}
        onSave={handleProfileSave}
      />
    );
  }

  if (screen === 'login' || screen === 'register') {
    return (
      <AuthScreen
        mode={screen}
        sidePadding={sidePadding}
        verticalScale={verticalScale}
        widthScale={widthScale}
        insets={insets}
        onOpenRegister={openRegister}
        onOpenLogin={openLogin}
        onSubmit={screen === 'login' ? handleLoginSubmit : handleRegisterSubmit}
        onBack={goBack}
        formValues={screen === 'login' ? loginForm : registerForm}
        onChangeField={(field, value) => {
          if (screen === 'login') {
            setLoginValidationError('');
            setLoginForm((prev) => ({ ...prev, [field]: value }));
            return;
          }

          setRegisterValidationError('');
          setRegisterForm((prev) => ({ ...prev, [field]: value }));
        }}
        onChangeRemember={(value) => {
          if (screen === 'login') {
            setLoginForm((prev) => ({ ...prev, rememberMe: value }));
          } else {
            setRegisterForm((prev) => ({ ...prev, rememberMe: value }));
          }
        }}
        rememberMe={screen === 'login' ? loginForm.rememberMe : registerForm.rememberMe}
        loading={screen === 'login' ? authState.loginLoading : authState.registerLoading}
        errorMessage={screen === 'login' ? authState.loginError : authState.registerError}
        validationMessage={screen === 'login' ? loginValidationError : registerValidationError}
        statusMessage={screen === 'register' ? authState.registerSuccess : ''}
      />
    );
  }

  if (screen === 'splash') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Image
          source={require('../assets/images/Rectangle.png')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
          <View style={styles.splashCenter}>
            <CenterGraphic
              frameSize={rippleFrameSize}
              ringSizes={ringSizes}
              logoWidth={logoWidth}
              logoHeight={logoHeight}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Image
        source={require('../assets/images/Rectangle.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {onboardingState.loading && !slides.length ? (
          <View style={styles.onboardingStatusWrap}>
            <ActivityIndicator size="small" color="#F3F6FF" />
          </View>
        ) : onboardingState.error && !slides.length ? (
          <View style={styles.onboardingStatusWrap}>
            <Text style={styles.onboardingStatusText}>{onboardingState.error}</Text>
            <TouchableOpacity style={styles.onboardingRetryButton} activeOpacity={0.85} onPress={() => dispatch(fetchOnboarding())}>
              <Text style={styles.onboardingRetryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.slidesWrap}>
            <FlatList
              ref={listRef}
              data={slides}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setCurrentIndex(index);
              }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.slide,
                    {
                      width: screenWidth,
                      minHeight: slideMinHeight,
                      paddingHorizontal: sidePadding,
                      paddingBottom: bottomDockHeight + nextToDockGap,
                    },
                  ]}>
                  <View style={styles.topContent}>
                    <View style={[styles.graphicSlot, { height: graphicSlotHeight }]}>
                      <View
                        style={[
                          styles.graphicAnchor,
                          {
                            top: graphicTopOffset,
                            marginLeft: -rippleFrameSize / 2,
                          },
                        ]}>
                        <CenterGraphic
                          frameSize={rippleFrameSize}
                          ringSizes={ringSizes}
                          logoWidth={logoWidth}
                          logoHeight={logoHeight}
                        />
                      </View>
                    </View>

                    <Text style={[styles.title, { marginTop: titleTopSpacing }]}>{item.title}</Text>
                    <Text style={[styles.description, { marginTop: descriptionTopSpacing }]}>{item.description}</Text>

                    <View style={[styles.pagination, { marginTop: indicatorsTopSpacing }]}>
                      {slides.map((slide, index) => (
                        <View
                          key={slide.id}
                          style={[styles.dot, index === currentIndex ? styles.dotActive : styles.dotInactive]}
                        />
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[styles.primaryButton, { marginTop: nextButtonTopSpacing }]}
                      activeOpacity={0.85}
                      onPress={goToNext}>
                      <Text style={styles.primaryButtonText}>
                        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        <View style={[styles.fixedBottom, { paddingHorizontal: sidePadding, bottom: dockBottom }]}>
          <TouchableOpacity activeOpacity={0.2} style={[styles.arrowButton, { marginBottom: arrowGap }]}>
            <Animated.View style={[styles.arrowStack, { transform: [{ translateY: arrowFloat }] }]}>
              <Image source={require('../assets/images/angle-double-small-up 1.png')} style={styles.arrowUpIcon} contentFit="contain" />
            </Animated.View>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
      <View style={{ paddingHorizontal: sidePadding}}>
          <View style={styles.loginCard}>
            <TouchableOpacity activeOpacity={0.85} onPress={openRegister}>
              <Text style={styles.loginCardText}>Don&apos;t have an account? Need Help!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.9} onPress={openLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C266C',
    overflow: 'hidden',
  },
  dashboardDrawerShell: {
    flex: 1,
    backgroundColor: '#143F93',
  },
  dashboardDrawerMenuLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  dashboardDrawerDashboardLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  dashboardDrawerBackdropCard: {
    position: 'absolute',
    zIndex: 2,
    overflow: 'hidden',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
  },
  dashboardDrawerBackdropTopSection: {
    width: '100%',
    backgroundColor: '#1B448F',
  },
  dashboardDrawerBackdropBottomSection: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(184, 197, 223, 0.95)',
  },
  dashboardDrawerDashboardLayerOpen: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#0A1834',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: -6, height: 10 },
    elevation: 9,
  },
  dashboardDrawerDashboardTapTarget: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  slidesWrap: {
    flex: 1,
  },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingStatusWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  onboardingStatusText: {
    color: '#F3F6FF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  onboardingRetryButton: {
    marginTop: 14,
    minWidth: 112,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#59B86E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  onboardingRetryText: {
    color: '#F4FFF8',
    fontSize: 13,
    fontWeight: '600',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topContent: {
    width: '100%',
    alignItems: 'center',
  },
  graphicSlot: {
    width: '100%',
    position: 'relative',
  },
  graphicAnchor: {
    position: 'absolute',
    left: '50%',
  },
  centerGraphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '100%',
    color: '#F3F6FF',
    fontSize: 30,
    lineHeight: 31,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    width: '100%',
    color: 'rgba(230, 238, 255, 0.95)',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 8,
    marginBottom:20,
  },
  dotActive: {
    width: 26,
    height: 9,
    backgroundColor: '#F2F4FF',
  },
  dotInactive: {
    width: 9,
    height: 9,
    backgroundColor: 'rgba(194, 206, 239, 0.5)',
    
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#59B86E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#F4FFF8',
    fontSize: 16,
    fontWeight: '500',
  },
  fixedBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  arrowButton: {
    paddingBottom: 10,
   
  },
  arrowStack: {
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  arrowUpIcon: {
    width: 28,
    height: 28,
    marginBottom: 0,
   
  },
  loginCard: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: 'rgba(7, 39, 92, 0.64)',
    borderWidth: 1,
    borderColor: 'rgba(121, 164, 255, 0.14)',
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
 
  },
  loginCardText: {
    color: 'rgba(228, 238, 255, 0.96)',
    fontSize: 18,
    lineHeight: 18,
    marginBottom: 25,
    marginTop:20,
  },
  loginButton: {
    width: '76%',
    height: 50,
    borderRadius: 4,
    backgroundColor: '#1C4293',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  loginButtonText: {
    color: '#F1F5FF',
    fontSize: 16,
    fontWeight: '500',
  },
  authScreen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    overflow: 'hidden',
  },
  authHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  authBackButton: {
    position: 'absolute',
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBody: {
    flex: 1,
    alignItems: 'center',
  },
  authLogoBadgeWrap: {
    position: 'absolute',
    left: '50%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authLogoBadgeBackground: {
    width: '120%',
    height: '120%',
  },
  authLogoBadgeMarkWrap: {
    position: 'absolute',
    top: -20,
    right: 8,
    bottom: 5,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authLogoBadgeMark: {
    transform: [{ translateX: -6 }, { translateY: 0 }],
  },
  authTitle: {
    color: '#2B2B2B',
    fontSize: 27,
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '700',
  },
  authDescription: {
    color: '#5E5E5E',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  authField: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  authInput: {
    flex: 1,
    height: '100%',
    color: '#2B2B2B',
    fontSize: 16,
    paddingVertical: 0,
  },
  authFieldIconButton: {
    height: 36,
    justifyContent: 'center',
    paddingLeft: 6,
  },
  authActionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#59B86E',
    fontSize: 14,
    marginLeft: 8,
  },
  forgotText: {
    color: '#59B86E',
    fontSize: 14,
  },
  authPrimaryButton: {
    width: '100%',
    height: 45,
    borderRadius: 3,
    backgroundColor: '#59B86E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authPrimaryButtonText: {
    color: '#F4FFF8',
    fontSize: 16,
    fontWeight: '500',
  },
  authErrorText: {
    color: '#DA3D37',
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
  },
  authStatusText: {
    color: '#59B86E',
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
  },
  authRegisterPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authPromptText: {
    color: '#6A6A6A',
    fontSize: 13,
  },
  authPromptLink: {
    color: '#59B86E',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  
});
