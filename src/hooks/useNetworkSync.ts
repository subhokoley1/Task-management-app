import {useEffect, useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {fetchTasks} from '@/redux/slices/taskSlice';
import {runSync, setOnlineStatus, setPendingCount} from '@/redux/slices/syncSlice';
import {taskRepository} from '@/database/taskRepository';
import Toast from 'react-native-toast-message';

export const useNetworkSync = (): void => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.auth.user?.uid);
  const wasOffline = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable);
      dispatch(setOnlineStatus(isOnline));

      if (!userId) {
        return;
      }

      if (isOnline) {
        if (wasOffline.current) {
          Toast.show({
            type: 'info',
            text1: 'Back online',
            text2: 'Syncing your tasks...',
          });
        }
        dispatch(runSync(userId)).then(() => {
          dispatch(fetchTasks(userId));
          taskRepository.getPendingQueue(userId).then(queue => {
            dispatch(setPendingCount(queue.length));
          });
        });
        wasOffline.current = false;
      } else {
        wasOffline.current = true;
      }
    });

    return () => unsubscribe();
  }, [dispatch, userId]);
};
