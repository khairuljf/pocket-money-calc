import { ChevronRight, Info, Mail, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const PANEL_WIDTH = Math.min(288, SCREEN_WIDTH * 0.8);
const OPEN_DURATION = 240;
const CLOSE_DURATION = 200;

export function MenuDrawer({
  visible,
  onClose,
  onOpenAbout,
  onOpenContact,
}: Props) {
  const [mounted, setMounted] = useState(visible);
  const translateX = useSharedValue(-PANEL_WIDTH);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.value = -PANEL_WIDTH;
      backdrop.value = 0;
      requestAnimationFrame(() => {
        translateX.value = withTiming(0, { duration: OPEN_DURATION });
        backdrop.value = withTiming(1, { duration: OPEN_DURATION });
      });
    } else if (mounted) {
      translateX.value = withTiming(-PANEL_WIDTH, { duration: CLOSE_DURATION });
      backdrop.value = withTiming(0, { duration: CLOSE_DURATION }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
  }, [visible, mounted, translateX, backdrop]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const handleSelect = (cb: () => void) => {
    onClose();
    cb();
  };

  if (!mounted) return null;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={visible ? "auto" : "box-none"}
    >
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable
          accessibilityLabel="Close menu"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        style={[styles.panel, { width: PANEL_WIDTH }, panelStyle]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <SafeAreaView edges={["top", "left", "bottom"]} className="flex-1">
          <View className="flex-row items-center justify-between border-b border-slate-100 px-4 py-3">
            <Text
              className="flex-1 pr-2 text-lg font-bold text-slate-900"
              numberOfLines={1}
            >
              PocketCash
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityLabel="Close menu"
              className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
            >
              <X color="#475569" size={18} />
            </Pressable>
          </View>

          <View className="px-2 py-2">
            <MenuItem
              icon={<Info color="#4f46e5" size={18} />}
              label="About"
              onPress={() => handleSelect(onOpenAbout)}
            />
            <MenuItem
              icon={<Mail color="#4f46e5" size={18} />}
              label="Contact Us"
              onPress={() => handleSelect(onOpenContact)}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-xl px-3 py-3 active:bg-slate-100"
    >
      <View className="flex-row items-center">
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
          {icon}
        </View>
        <Text className="text-base font-medium text-slate-800">{label}</Text>
      </View>
      <ChevronRight color="#94a3b8" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
});
