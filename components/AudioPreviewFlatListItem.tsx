import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { ThemedText } from './ThemedText'
import { useEffect, useState } from 'react'

const AudioPreviewFlatListItem = ({ name, uri, onPress }: { name: string, uri: string, onPress: () => any }) => {
    const [sound, setSound] = useState<Audio.Sound>()
    const [isPlaying, setIsPlaying] = useState(false)
    const colorScheme = useColorScheme()
    const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text

    const loadSound = async () => {
        const { sound } = await Audio.Sound.createAsync({ uri })

        sound.setOnPlaybackStatusUpdate(async (status) => {
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

    useEffect(() => {
        loadSound()
    }, [])

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync()
        } : undefined
    }, [sound])

    return (
        <View style={[styles.constainer, { borderColor: textColor }]}>
            <Ionicons
                name='musical-note'
                color={textColor}
                size={18}
                style={{ position: 'absolute', top: 8, left: 8 }}
            />
            <Pressable style={styles.pressable} onPress={onPress}>
                <Ionicons
                    name='close-circle'
                    color={textColor}
                    size={18}
                />
            </Pressable>
            {isPlaying ? <Pressable onPress={pauseSound}>
                <Ionicons
                    name='pause'
                    color={textColor}
                    size={30}
                />
            </Pressable> : <Pressable onPress={playSound}>
                <Ionicons
                    name='play'
                    color={textColor}
                    size={30}
                />
            </Pressable>}
            <ThemedText style={styles.name} numberOfLines={1}>{name}</ThemedText>
        </View>
    )
}

export default AudioPreviewFlatListItem

const styles = StyleSheet.create({
    constainer: {
        height: 100,
        width: 100,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    pressable: {
        position: 'absolute',
        top: 4,
        right: 4,
        padding: 4
    },
    name: {
        fontSize: 10,
        position: 'absolute',
        bottom: 4
    }
})