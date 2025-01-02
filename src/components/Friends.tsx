import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { getUserData, claimReward } from '../api';
import './Friends.css';

interface Friend {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: string;
  totalCoins: string;
  level: string;
  photoUrl?: string;
}

interface PendingReward {
  id: number;
  amount: string;
  referredUserId: string;
  referredUserName: string;
  createdAt: string;
}

interface UserData {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: string;
  totalCoins: string;
  level: string;
  referralCode: string;
  referralLink: string;
  photoUrl?: string;
  friends: Friend[];
  hasUnclaimedRewards: boolean;
  pendingRewards?: PendingReward[];
}

const Friends: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [claimingRewardId, setClaimingRewardId] = useState<number | null>(null);
  const { user, tg } = useTelegram();

  const getPendingRewards = (data: UserData | null): PendingReward[] => {
    if (!data || !Array.isArray(data.pendingRewards)) return [];
    return data.pendingRewards;
  };

  const hasAvailableRewards = useCallback((data: UserData | null): boolean => {
    return Boolean(
      data?.hasUnclaimedRewards &&
      Array.isArray(data?.pendingRewards) &&
      data.pendingRewards.length > 0
    );
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      const data = await getUserData(userId);
      console.log('Received user data:', data);
      setUserData(data);

      if (hasAvailableRewards(data)) {
        console.log('User has unclaimed rewards');
        setShowRewardsModal(true);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      throw new Error('Failed to load user data. Please try again later.');
    }
  }, [hasAvailableRewards]);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        setLoading(true);
        const userId = user?.id?.toString() || localStorage.getItem('userId');

        if (!userId) {
          throw new Error('User ID is not available');
        }

        if (isMounted) {
          await fetchUserData(userId);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void initializeData();

    return () => {
      isMounted = false;
    };
  }, [user, fetchUserData]);

  const handleClaimReward = async (rewardId: number) => {
    if (!user?.id) return;

    try {
      setClaimingRewardId(rewardId);

      console.log('Claiming reward:', rewardId, 'for user:', user.id);
      await claimReward(user.id.toString(), rewardId);

      await fetchUserData(user.id.toString());
    } catch (error) {
      console.error('Error claiming reward:', error);
      setError('Failed to claim reward. Please try again later.');
    } finally {
      setClaimingRewardId(null);
    }
  };

  const handleInviteFriend = useCallback(() => {
    if (!userData?.referralLink) {
      setError('Referral link is not available');
      return;
    }

    console.log('Sharing referral link:', userData.referralLink);

    if (tg && 'shareUrl' in tg) {
      tg.shareUrl(userData.referralLink);
    } else {
      const shareText = `Join me in TWASH COIN and get a bonus! Use my referral link: ${userData.referralLink}`;

      if (navigator.share) {
        void navigator.share({
          title: 'Invitation to TWASH COIN',
          text: shareText,
          url: userData.referralLink
        });
      } else {
        void navigator.clipboard.writeText(shareText)
          .then(() => alert('Referral link copied! Share it with your friends.'))
          .catch(() => alert(`Couldn't copy the link. Please copy it manually: ${userData.referralLink}`));
      }
    }
  }, [userData?.referralLink, tg]);

  if (loading) {
    return (
      <div className="friends-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const currentRewards = getPendingRewards(userData);
  const showRewards = hasAvailableRewards(userData);

  return (
    <div className="friends-page">
      <h1 className="page-title">Friends</h1>

      <div className="profile-section">
        <span className="profile-label">My Profile</span>
        {showRewards && (
          <button
            className="reward-button blinking"
            onClick={() => setShowRewardsModal(true)}
          >
            <img src="/images/gift.png" alt="Rewards" className="reward-icon" />
          </button>
        )}
        <img
          src={userData?.photoUrl || '/images/logotg.png'}
          alt="Profile"
          className="profile-avatar"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/logotg.png';
          }}
        />
        <div className="profile-info">
          <span className="profile-name">
            {userData?.firstName || 'User'} {userData?.lastName || ''}
          </span>
          <span className="profile-level">{userData?.level || 'Silver'}</span>
        </div>
      </div>

      {showRewardsModal && showRewards && currentRewards.length > 0 && (
        <div className="rewards-modal" onClick={() => setShowRewardsModal(false)}>
          <div className="rewards-modal-content" onClick={e => e.stopPropagation()}>
            <h2>Your Rewards</h2>
            <div className="rewards-list">
              {currentRewards.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <div className="reward-info">
                    <p>Referral bonus for inviting {reward.referredUserName}!</p>
                    <p className="reward-amount">{reward.amount} coins</p>
                  </div>
                  <button
                    className="claim-button"
                    onClick={() => handleClaimReward(reward.id)}
                    disabled={claimingRewardId === reward.id}
                  >
                    {claimingRewardId === reward.id ? 'Claiming...' : 'Claim'}
                  </button>
                </div>
              ))}
            </div>
            <button
              className="close-modal-button"
              onClick={() => setShowRewardsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="referral-info">
        <span className="referral-text">
          Invite friends and get 1000 coins for each referral!
        </span>
      </div>

      <button onClick={handleInviteFriend} className="invite-button">
        Invite a friend
      </button>

      <div className="friends-section">
        <div className="friends-header">
          <h2>My Friends ({userData?.friends?.length || 0})</h2>
        </div>

        {userData?.friends && userData.friends.length > 0 ? (
          <div className="friends-list">
            {userData.friends.map((friend) => (
              <div key={friend.telegramId} className="friend-card">
                <img
                  src={friend.photoUrl || '/images/logotg.png'}
                  alt={friend.firstName}
                  className="friend-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/logotg.png';
                  }}
                />
                <div className="friend-info">
                  <span className="friend-name">
                    {friend.firstName} {friend.lastName}
                  </span>
                  <span className="friend-level">{friend.level || 'Silver'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-friends-message">
            You don't have any friends yet. Invite them to get bonuses!
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;