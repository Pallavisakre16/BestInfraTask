import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedRippleRings } from '../animated-ripple-rings';
import { DashboardLogo } from './dashboard-logo';
import { getDashboardTheme } from './dashboard-theme';

const PROFILE_RIPPLE_SIZES = [102, 136, 170, 204, 238, 272, 306, 340];
const CONTENT_MAX_WIDTH = 460;

function createDraft(profileData) {
  return {
    name: profileData?.name || '',
    phone: profileData?.phone || '',
    email: profileData?.email || '',
    address: profileData?.address || '',
  };
}

function getInitials(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return 'BI';
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}

function maskPhone(phone) {
  const digits = (phone || '').trim();

  if (!digits) {
    return 'Phone Number';
  }

  if (digits.length <= 7) {
    return digits;
  }

  return `${digits.slice(0, 5)}***${digits.slice(-4)}`;
}

function InfoRow({ label, value, valueStrong }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStrong && styles.infoValueStrong]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ProfileField({ value, onChangeText, placeholder, editable, multiline, keyboardType }) {
  if (!editable) {
    return (
      <View style={styles.fieldShell}>
        <Text style={[styles.fieldText, !value && styles.fieldPlaceholder]}>{value || placeholder}</Text>
      </View>
    );
  }

  return (
    <TextInput
      style={[styles.fieldShell, styles.fieldInput, multiline && styles.fieldInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8E8E8E"
      keyboardType={keyboardType}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

export function DashboardProfileScreen({
  insets,
  sidePadding,
  themeMode,
  onBack,
  onLogout,
  profileData,
  dashboardData,
  saving,
  onSave,
}) {
  const theme = getDashboardTheme(themeMode);
  const horizontalPadding = Math.max(12, Math.min(22, sidePadding - 1));
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(createDraft(profileData));
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isEditing) {
      setDraft(createDraft(profileData));
    }
  }, [isEditing, profileData]);

  const avatarLabel = getInitials(profileData?.name);
  const consumerId = profileData?.customerId || 'GMR2024567890';
  const meterNumber = dashboardData?.overview?.connectionNumber || dashboardData?.alerts?.[0]?.meterNumber || 'MTR-456789';
  const connectionType = 'Residential';

  const handleEdit = () => {
    setSubmitError('');
    setDraft(createDraft(profileData));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSubmitError('');
    setDraft(createDraft(profileData));
    setIsEditing(false);
  };

  const handleSave = async () => {
    const result = await onSave(draft);

    if (!result?.ok) {
      setSubmitError(result?.message || 'Profile update failed');
      return;
    }

    setSubmitError('');
    setIsEditing(false);
  };

  return (
    <View style={[styles.screen, { backgroundColor: '#E3EBE6' }]}>
      <AnimatedRippleRings color="rgba(191, 204, 199, 0.5)" sizes={PROFILE_RIPPLE_SIZES} style={styles.rippleBackdrop} />

      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + 24,
              maxWidth: CONTENT_MAX_WIDTH,
              width: '100%',
              alignSelf: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: theme.topButtonSurface, shadowColor: theme.shadowColor }]}
              activeOpacity={0.85}
              onPress={onBack}>
              <Image
                source={require('../../assets/images/bars-staggered 2.png')}
                style={styles.headerIcon}
                contentFit="contain"
              />
            </TouchableOpacity>

            <View pointerEvents="none" style={styles.centerLogoWrap}>
              <DashboardLogo width={32} height={28} />
            </View>

            <TouchableOpacity
              style={[styles.circleButton, styles.rightButton, { backgroundColor: theme.topButtonSurface, shadowColor: theme.shadowColor }]}
              activeOpacity={0.85}
              onPress={onLogout}>
              <Image
                source={require('../../assets/images/sign-out-alt 1.png')}
                style={styles.headerIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.avatarWrap, isEditing && styles.avatarWrapEditing]}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{avatarLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderText}>Account Information</Text>
            </View>

            <View style={styles.infoBody}>
              <InfoRow label="Consumer ID" value={consumerId} valueStrong />
              <InfoRow label="Meter Number" value={meterNumber} valueStrong />
              <InfoRow label="Connection Type" value={connectionType} valueStrong />
            </View>
          </View>

          <View style={styles.fieldsWrap}>
            <ProfileField
              value={draft.name}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, name: value }))}
              placeholder="Name"
              editable={isEditing}
            />
            <ProfileField
              value={isEditing ? draft.phone : maskPhone(draft.phone)}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, phone: value }))}
              placeholder="Phone Number"
              editable={isEditing}
              keyboardType="phone-pad"
            />
            <ProfileField
              value={draft.email}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, email: value }))}
              placeholder="Email@"
              editable={isEditing}
              keyboardType="email-address"
            />
            <ProfileField
              value={draft.address}
              onChangeText={(value) => setDraft((prev) => ({ ...prev, address: value }))}
              placeholder="Address"
              editable={isEditing}
              multiline={isEditing}
            />
          </View>

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          {isEditing ? (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={handleCancel} disabled={saving}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#F4FFF8" />
                ) : (
                  <Text style={styles.primaryButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.primaryButtonFull} activeOpacity={0.9} onPress={handleEdit}>
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {Platform.OS === 'ios' ? <View style={styles.homeIndicator} /> : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  rippleBackdrop: {
    position: 'absolute',
    top: -74,
    left: 0,
    right: 0,
    height: 350,
  },
  content: {
    minHeight: '100%',
  },
  topBar: {
    height: 56,
    marginTop: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  circleButton: {
    position: 'absolute',
    left: 0,
    width: 55,
    height: 55,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rightButton: {
    left: undefined,
    right: 0,
  },
  centerLogoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  avatarWrapEditing: {
    marginTop: 20,
  },
  avatarOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#7B8AA0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    width: '100%',
    borderRadius: 50,
    backgroundColor: '#516A86',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 39,
    fontWeight: '700',
  },
  infoCard: {
    marginTop: 22,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  infoHeader: {
    minHeight: 50,
    backgroundColor: '#59B86E',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  infoHeaderText: {
    color: '#FFFFFF',
    fontSize: 18.2,
    lineHeight: 16,
    fontWeight: '500',
  },
  infoBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    rowGap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
    color: '#707070',
    fontSize: 15.6,
    lineHeight: 16,
  },
  infoValue: {
    maxWidth: '58%',
    color: '#707070',
    fontSize: 15.6,
    lineHeight: 16,
    textAlign: 'right',
  },
  infoValueStrong: {
    color: '#5D5D5D',
    fontWeight: '700',
  },
  fieldsWrap: {
    marginTop: 14,
    rowGap: 12,
  },
  fieldShell: {
    minHeight: 46,
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  fieldInput: {
    color: '#4F4F4F',
    fontSize: 15.6,
    paddingVertical: 0,
  },
  fieldInputMultiline: {
    minHeight: 62,
    paddingVertical: 12,
  },
  fieldText: {
    color: '#6F6F6F',
    fontSize: 15.6,
    lineHeight: 16,
  },
  fieldPlaceholder: {
    color: '#8E8E8E',
  },
  errorText: {
    marginTop: 10,
    color: '#D8423A',
    fontSize: 15.6,
    lineHeight: 16,
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    width: '47%',
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#59B86E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#6F6F6F',
    fontSize: 16.25,
    fontWeight: '500',
  },
  primaryButton: {
    width: '47%',
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59B86E',
  },
  primaryButtonFull: {
    marginTop: 14,
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59B86E',
  },
  primaryButtonText: {
    color: '#F4FFF8',
    fontSize: 18.2,
    fontWeight: '700',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 120,
    height: 4,
    borderRadius: 999,
    marginTop: 86,
    backgroundColor: '#24387A',
  },
});
