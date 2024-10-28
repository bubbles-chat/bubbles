import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider'
import { ThemedText } from './ThemedText'
import { convertMillisToTime } from '@/utils/date'

const AudioMessageFlatListItem = ({ uri }: { uri: string }) => {
    const [sound, setSound] = useState<Audio.Sound>()
    const [isPlaying, setIsPlaying] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [duration, setDuration] = useState<string>()
    const [currentPosition, setCurrentPosition] = useState<string>()
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
    const tintColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint

    const loadSound = async () => {
        const { sound } = await Audio.Sound.createAsync({ uri })

        sound.setOnPlaybackStatusUpdate(async (status) => {
            if (!duration && status.isLoaded && status.durationMillis) {
                setDuration(convertMillisToTime(status.durationMillis))
            }
            if (status.isLoaded && status.durationMillis) {
                setCurrentPosition(convertMillisToTime(status.positionMillis))
                setSliderValue(status.positionMillis / status.durationMillis)
            }
            if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false)
                sound.setPositionAsync(0)
                await sound.pauseAsync()
            }
        })
        setSound(sound)
    }

    const playSound = async () => {
        await sound?.playAsync()
        setIsPlaying(true)
    }

    const pauseSound = async () => {
        sound?.pauseAsync()
        setIsPlaying(false)
    }

    const onSlidingComplete = async (position: number) => {
        const status = await sound?.getStatusAsync()

        if (status?.isLoaded && status.durationMillis) {
            await sound?.setPositionAsync(status.durationMillis * position)
        }
    }

    useEffect(() => {
        loadSound()
    }, [])

    return (
        <View style={[styles.container, { borderColor: textColor, backgroundColor }]}>
            <View style={styles.rowView}>
                <Ionicons
                    name='musical-note'
                    size={18}
                    color={textColor}
                />
                <Slider
                    style={styles.slider}
                    value={sliderValue}
                    minimumValue={0}
                    maximumValue={1}
                    maximumTrackTintColor={tintColor}
                    onSlidingComplete={onSlidingComplete}
                />
                {isPlaying ? <Pressable style={styles.playPauseBtn} onPress={pauseSound}>
                    <Ionicons
                        name='pause'
                        color={textColor}
                        size={18}
                    />
                </Pressable> : <Pressable style={styles.playPauseBtn} onPress={playSound}>
                    <Ionicons
                        name='play'
                        color={textColor}
                        size={18}
                    />
                </Pressable>}
            </View>
            <View style={styles.rowView}>
                <ThemedText style={styles.timeText}>{currentPosition}</ThemedText>
                <ThemedText style={styles.timeText}>{duration}</ThemedText>
            </View>
        </View>
    )
}

export default AudioMessageFlatListItem

const styles = StyleSheet.create({
    container: {
        width: 200,
        borderRadius: 8,
        borderWidth: 1,
        padding: 8
    },
    playPauseBtn: {
        padding: 8
    },
    slider: {
        flex: 1
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    timeText: {
        fontSize: 11
    }
})